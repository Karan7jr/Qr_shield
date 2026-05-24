from flask import Blueprint, request, jsonify
from models import db, Scan
from sqlalchemy import text

history_bp = Blueprint("history", __name__)


@history_bp.route("/api/history", methods=["GET"])
def get_history():
    page        = request.args.get("page", 1, type=int)
    per_page    = request.args.get("per_page", 20, type=int)
    risk_filter = request.args.get("risk", None)
    search      = request.args.get("search", None)

    query = Scan.query

    if risk_filter and risk_filter in ("low", "medium", "high", "unknown"):
        query = query.filter(Scan.risk_level == risk_filter)

    if search:
        query = query.filter(
            (Scan.raw_content.ilike(f"%{search}%")) |
            (Scan.domain.ilike(f"%{search}%"))
        )

    paginated = query.order_by(Scan.scanned_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "scans":    [s.to_dict() for s in paginated.items],
        "total":    paginated.total,
        "page":     paginated.page,
        "pages":    paginated.pages,
        "per_page": per_page,
    }), 200


@history_bp.route("/api/history/<int:scan_id>", methods=["DELETE"])
def delete_scan(scan_id):
    scan = Scan.query.get_or_404(scan_id)
    db.session.delete(scan)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


@history_bp.route("/api/history", methods=["DELETE"])
def clear_history():
    Scan.query.delete()
    db.session.commit()
    return jsonify({"message": "All scans cleared"}), 200


@history_bp.route("/api/stats", methods=["GET"])
def get_stats():
    total   = Scan.query.count()
    low     = Scan.query.filter_by(risk_level="low").count()
    medium  = Scan.query.filter_by(risk_level="medium").count()
    high    = Scan.query.filter_by(risk_level="high").count()
    unknown = Scan.query.filter_by(risk_level="unknown").count()

    daily = db.session.execute(text("""
        SELECT DATE(scanned_at) as day, COUNT(*) as count
        FROM scans
        WHERE scanned_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(scanned_at)
        ORDER BY day ASC
    """)).fetchall()

    top_domains = db.session.execute(text("""
        SELECT domain, COUNT(*) as count
        FROM scans
        WHERE domain IS NOT NULL AND domain != ''
        GROUP BY domain
        ORDER BY count DESC
        LIMIT 5
    """)).fetchall()

    return jsonify({
        "total":        total,
        "low":          low,
        "medium":       medium,
        "high":         high,
        "unknown":      unknown,
        "safe_percent": round((low / total * 100) if total > 0 else 0, 1),
        "daily_scans":  [{"day": str(r[0]), "count": r[1]} for r in daily],
        "top_domains":  [{"domain": r[0], "count": r[1]} for r in top_domains],
    }), 200