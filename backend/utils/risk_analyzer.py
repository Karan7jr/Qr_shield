from urllib.parse import urlparse
import re

URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly",
    "short.io", "rebrand.ly", "is.gd", "tiny.cc", "cutt.ly",
    "bl.ink", "buff.ly", "adf.ly", "lnkd.in", "mcaf.ee"
]

DANGER_KEYWORDS = [
    "login", "signin", "sign-in", "password", "passwd",
    "verify", "verification", "account", "secure", "security",
    "bank", "banking", "paypal", "update", "confirm",
    "free", "win", "winner", "prize", "reward", "offer",
    "apk", "download", "install", "click", "redirect",
    "suspend", "suspended", "limited", "urgent", "alert",
    "recover", "unlock", "access", "credential"
]


def analyze(raw_content: str) -> dict:
    result = {
        "raw_content":     raw_content,
        "content_type":    "unknown",
        "url":             None,
        "domain":          None,
        "is_https":        False,
        "is_shortener":    False,
        "risk_level":      "unknown",
        "risk_score":      0,
        "risk_reasons":    [],
        "danger_keywords": [],
    }

    low = raw_content.lower().strip()

    if low.startswith("http://") or low.startswith("https://"):
        result["content_type"] = "url"
        result["url"] = raw_content
    elif low.startswith("wifi:"):
        result["content_type"] = "wifi"
        result["risk_level"] = "low"
        return result
    elif low.startswith("tel:"):
        result["content_type"] = "phone"
        result["risk_level"] = "unknown"
        return result
    elif low.startswith("mailto:"):
        result["content_type"] = "email"
        result["risk_level"] = "low"
        result["risk_score"] = 5
        return result
    elif low.startswith("begin:vcard"):
        result["content_type"] = "vcard"
        result["risk_level"] = "low"
        return result
    elif low.startswith("upi://") or "upi" in low:
        result["content_type"] = "upi"
        result["risk_level"] = "medium"
        result["risk_reasons"].append("UPI payment — verify recipient before paying")
        return result
    else:
        result["content_type"] = "text"
        result["risk_level"] = "unknown"
        return result

    try:
        parsed = urlparse(raw_content)
        result["domain"]   = parsed.netloc
        result["is_https"] = parsed.scheme == "https"
        url_lower          = raw_content.lower()

        if not result["is_https"]:
            result["risk_score"] += 40
            result["risk_reasons"].append("Not secured with HTTPS — data can be intercepted")

        result["is_shortener"] = any(s in result["domain"] for s in URL_SHORTENERS)
        if result["is_shortener"]:
            result["risk_score"] += 30
            result["risk_reasons"].append("URL shortener hides real destination")

        result["danger_keywords"] = [kw for kw in DANGER_KEYWORDS if kw in url_lower]
        if result["danger_keywords"]:
            result["risk_score"] += len(result["danger_keywords"]) * 12
            result["risk_reasons"].append(
                f"Suspicious keywords found: {', '.join(result['danger_keywords'][:5])}"
            )

        if re.match(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", result["domain"]):
            result["risk_score"] += 50
            result["risk_reasons"].append("URL uses raw IP address — highly suspicious")

        if result["domain"].count(".") > 3:
            result["risk_score"] += 20
            result["risk_reasons"].append("Unusually many subdomains — possible phishing")

        if result["risk_score"] == 0:
            result["risk_level"] = "low"
        elif result["risk_score"] <= 40:
            result["risk_level"] = "medium"
        else:
            result["risk_level"] = "high"

    except Exception:
        result["risk_level"]  = "high"
        result["risk_score"]  = 100
        result["risk_reasons"].append("Malformed or unreadable URL — treat with caution")

    return result