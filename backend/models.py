from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Scan(db.Model):
    __tablename__ = "scans"

    id              = db.Column(db.Integer, primary_key=True, autoincrement=True)
    raw_content     = db.Column(db.Text, nullable=False)
    content_type    = db.Column(db.String(20), default="url")
    url             = db.Column(db.Text)
    domain          = db.Column(db.String(255))
    is_https        = db.Column(db.Boolean, default=False)
    is_shortener    = db.Column(db.Boolean, default=False)
    risk_level      = db.Column(db.Enum("low","medium","high","unknown"), default="unknown")
    risk_score      = db.Column(db.Integer, default=0)
    risk_reasons    = db.Column(db.Text)
    danger_keywords = db.Column(db.Text)
    ip_address      = db.Column(db.String(45))
    user_agent      = db.Column(db.String(500))
    scanned_at      = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id":              self.id,
            "raw_content":     self.raw_content,
            "content_type":    self.content_type,
            "url":             self.url,
            "domain":          self.domain,
            "is_https":        self.is_https,
            "is_shortener":    self.is_shortener,
            "risk_level":      self.risk_level,
            "risk_score":      self.risk_score,
            "risk_reasons":    json.loads(self.risk_reasons) if self.risk_reasons else [],
            "danger_keywords": self.danger_keywords.split(",") if self.danger_keywords else [],
            "scanned_at":      self.scanned_at.isoformat() if self.scanned_at else None,
        }