import json
from flask import Blueprint, request, jsonify
from models import db, Scan
from utils.risk_analyzer import analyze

scan_bp = Blueprint("scan", __name__)


@scan_bp.route("/api/scan", methods=["POST"])
def scan_qr():
    data = request.get_json()
    if not data or "content" not in data:
        return jsonify({"error": "Missing 'content' field"}), 400

    raw = data["content"].strip()
    if not raw:
        return jsonify({"error": "Content cannot be empty"}), 400

    result = analyze(raw)

    scan = Scan(
        raw_content     = result["raw_content"],
        content_type    = result["content_type"],
        url             = result.get("url"),
        domain          = result.get("domain"),
        is_https        = result.get("is_https", False),
        is_shortener    = result.get("is_shortener", False),
        risk_level      = result["risk_level"],
        risk_score      = result.get("risk_score", 0),
        risk_reasons    = json.dumps(result.get("risk_reasons", [])),
        danger_keywords = ",".join(result.get("danger_keywords", [])),
        ip_address      = request.remote_addr,
        user_agent      = request.headers.get("User-Agent", "")[:500],
    )
    db.session.add(scan)
    db.session.commit()

    return jsonify({
        "scan_id":  scan.id,
        "analysis": result,
    }), 200


@scan_bp.route("/api/scan/<int:scan_id>", methods=["GET"])
def get_scan(scan_id):
    scan = Scan.query.get_or_404(scan_id)
    return jsonify(scan.to_dict()), 200