import os
import sys
import json
import traceback
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# Define ANSI colors for terminal prints
GREEN = "\033[92m"
CYAN = "\033[96m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"

def get_hr():
    """Generates a thin horizontal line as a ReportLab Flowable."""
    t = Table([['']], colWidths=['100%'], rowHeights=[1])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#E2E8F0')),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    return t

def create_pdf(filepath, title, metadata, sections, table_data=None):
    """Compiles a professional, data-dense PDF document with ReportLab."""
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom, premium Vercel/Linear-inspired styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )
    
    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=15
    )
    
    story = []
    
    # Title
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 4))
    
    # Metadata Block
    meta_items = [f"<b>{k}:</b> {v}" for k, v in metadata.items()]
    meta_text = "  |  ".join(meta_items)
    story.append(Paragraph(meta_text, meta_style))
    story.append(Spacer(1, 4))
    
    # Divider Line
    story.append(get_hr())
    story.append(Spacer(1, 12))
    
    # Section Content
    for sec_title, sec_paragraphs in sections:
        if sec_title:
            story.append(Paragraph(sec_title, subtitle_style))
            story.append(Spacer(1, 4))
        for p_text in sec_paragraphs:
            story.append(Paragraph(p_text, body_style))
            story.append(Spacer(1, 4))
            
    # Optional Table
    if table_data:
        story.append(Spacer(1, 8))
        
        hdr_style = ParagraphStyle(
            'TblHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=11,
            textColor=colors.HexColor('#F8FAFC')
        )
        
        cell_style = ParagraphStyle(
            'TblCell',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=11,
            textColor=colors.HexColor('#334155')
        )
        
        formatted_table = []
        # Header Row
        formatted_table.append([Paragraph(col, hdr_style) for col in table_data[0]])
        # Body Rows
        for row in table_data[1:]:
            formatted_table.append([Paragraph(str(cell), cell_style) for cell in row])
            
        t = Table(formatted_table, hAlign='LEFT')
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#F8FAFC'), colors.white])
        ]))
        story.append(t)
        story.append(Spacer(1, 10))
        
    doc.build(story)

def update_manifest(assets_dir, manifest_data):
    """Updates or creates assets_manifest.json inside assets directory."""
    manifest_path = os.path.join(assets_dir, "assets_manifest.json")
    existing_data = {}
    
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except Exception as e:
            print(f"{YELLOW}[WARNING]{RESET} Failed to read existing manifest: {e}")
            
    existing_data.update(manifest_data)
    
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)
        
    print(f"{GREEN}[SUCCESS]{RESET} Manifest updated: {manifest_path}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(script_dir, "assets")
    
    # 1. Initialize Directories
    dirs = {
        "regulatory_mandates": os.path.join(assets_dir, "regulatory_mandates"),
        "procurement_tenders": os.path.join(assets_dir, "procurement_tenders"),
        "audit_logs": os.path.join(assets_dir, "audit_logs")
    }
    
    print(f"{BOLD}{CYAN}=== Onyx Assets Directory Verification ==={RESET}")
    for name, path in dirs.items():
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"{GREEN}[CREATED]{RESET} Directory initialized: {path}")
        else:
            print(f"{CYAN}[VERIFIED]{RESET} Directory verified: {path}")
    print()

    # 2. Document Data Specifications
    documents = [
        # a) Regulatory Mandates
        {
            "category": "regulatory_mandates",
            "filename": "mandate_alpha_2026.pdf",
            "title": "Global Data Compliance Mandate (GDCM v4.2)",
            "metadata": {
                "Document ID": "GDCM-2026-ALPHA-042",
                "Version": "4.2",
                "Date": "May 2026",
                "Author": "Onyx Global Governance Board"
            },
            "sections": [
                ("Section 1: Purpose & Jurisdiction", [
                    "This document outlines the strict regulatory compliance directives governing global distributed information structures and cognitive multi-agent processing systems. Under Section 14.1 of the Accord on Digital Sovereignty, all entities deploying automated data-routing systems must enforce local data residency constraints.",
                    "The goal of GDCM v4.2 is to establish unified protocols for zero-leakage cognitive processing, protecting customer financial interests, institutional integrity, and national security boundaries in an era of autonomous agent routing."
                ]),
                ("Section 2: AI Multi-Agent Processing Standards", [
                    "Operational cognitive agents must not persist context memory blocks across distinct organizational domains. Any transient agent interaction must be encrypted via standard AES-GCM-256 protocols.",
                    "No agent may act as a relay for unverified credentials, and all inter-agent messages must carry authenticated headers specifying the transaction's originating client ID and security token."
                ]),
                ("Section 3: Spatial Data Sovereignty Limits", [
                    "All physical data hosts and local vector database indexes mapping user compliance data must operate within strict geographical boundaries.",
                    "Automated cross-border intelligence compilation is strictly prohibited unless routed through certified, low-latency zero-knowledge relays that verify data sovereignty compliance in real-time."
                ]),
                ("Section 4: Strict Zero-Retention Tokens", [
                    "Customer authentication passphrases and security key exchanges must employ zero-retention temporary tokens.",
                    "Session variables must be discarded from active memory tables immediately upon session termination, preventing background memory persistence from exposing sensitive institutional data structures."
                ])
            ],
            "table": None
        },
        {
            "category": "regulatory_mandates",
            "filename": "mandate_beta_2026.pdf",
            "title": "Financial Transparency Framework Directive (FTFD-2026)",
            "metadata": {
                "Document ID": "FTFD-2026-BETA-889",
                "Version": "1.0",
                "Date": "May 2026",
                "Author": "Federal Compliance Council"
            },
            "sections": [
                ("Section 1: Objective & Scope", [
                    "This directive institutes standard operational workflows for cross-border financial data tracking. All institutions performing automated ledger entries must maintain high-fidelity transaction records that allow complete audit trails.",
                    "Failure to adhere to the verification thresholds outlined in this document will result in automatic audit escalations and immediate operational suspension of the offending ledger channels."
                ]),
                ("Section 2: Cross-Border Verification Pipelines", [
                    "Verification pipelines must establish decentralized consensus checkpoints before completing settlement transactions.",
                    "Each consensus pipeline must verify transaction counterparty legitimacy against global embargo lists, validating the security certificates of the routing endpoints."
                ])
            ],
            "table": [
                ["Region", "Target SLA Compliance", "Max Allowed Latency", "Verification Tier"],
                ["APAC Region", "99.4%", "120ms", "Tier-1"],
                ["EMEA Region", "98.7%", "150ms", "Tier-1"],
                ["AMER Region", "99.9%", "90ms", "Tier-2"]
            ]
        },
        # b) Procurement Tenders
        {
            "category": "procurement_tenders",
            "filename": "tender_supply_091.pdf",
            "title": "Government Logistics & Supply Chain Procurement Tender",
            "metadata": {
                "Document ID": "TENDER-LOG-SUPPLY-091",
                "Version": "3.1",
                "Date": "May 2026",
                "Author": "Department of Supply & Infrastructure"
            },
            "sections": [
                ("Section 1: General Procurement Details", [
                    "The Department of Supply & Infrastructure is soliciting competitive proposals for the integration of autonomous logistic networks and tokenized supply routing pipelines.",
                    "Proposals must detail full system architecture, low-latency cognitive orchestration schemes, and compliance with the Federal Safety Protocol for autonomous agents."
                ]),
                ("Section 2: Technical Specifications & SLA Matrix", [
                    "Bidders must demonstrate adherence to the minimum performance metrics specified in the table below. Systems that do not meet these parameters will be disqualified without further evaluation."
                ])
            ],
            "table": [
                ["Requirement ID", "Technical Parameter", "Minimum Acceptable SLA"],
                ["REQ-001", "Maximum Agent Latency", "< 250ms under peak load"],
                ["REQ-002", "Daily Transaction Volume", "50,000,000 processed tokens"],
                ["REQ-003", "Encryption Standard", "AES-GCM-256 + TLS 1.3"],
                ["REQ-004", "Uptime Guarantee", "99.99% overall availability"]
            ],
            "extra_sections": [
                ("Section 3: SLA Metrics & Performance Monitoring", [
                    "Performance metrics will be monitored continuously via automated compliance agents. Uptime statistics and audit logs must be exposed to government auditors via a read-only secure API endpoint."
                ]),
                ("Section 4: Penalties for Integration Delays", [
                    "Integration delays beyond the scheduled 30-day sandbox testing period will incur liquid damages of $10,000 USD per business day, capped at 15% of the total procurement contract value."
                ])
            ]
        },
        {
            "category": "procurement_tenders",
            "filename": "tender_infra_092.pdf",
            "title": "Autonomous Systems Infrastructure Architecture Proposal",
            "metadata": {
                "Document ID": "TENDER-INFRA-092",
                "Version": "2.0",
                "Date": "May 2026",
                "Author": "Onyx Core Systems Group"
            },
            "sections": [
                ("Section 1: Executive Summary", [
                    "This document details the architectural design and hardware specifications for the cloud-native, border-driven multi-agent orchestration infrastructure. Our plan ensures maximum resource density and high-contrast diagnostic capabilities."
                ]),
                ("Section 2: Hardware and API Infrastructure Thresholds", [
                    "The physical infrastructure must utilize redundant 8x GPU nodes equipped with hardware-isolated memory contexts. Local networking links must support throughput speeds exceeding 400 Gbps to avoid processing bottlenecks during multi-agent workflows.",
                    "API communication channels must run over verified, secure gRPC tunnels with automatic rate-limiting and connection-pooling configurations."
                ]),
                ("Section 3: Security Compliance Parameters", [
                    "All systems are subject to annual SOC 2 Type II audits, physical site reviews, and external penetration tests. Security telemetry must be streamed in real-time to the central Onyx Security Operations Center."
                ]),
                ("Section 4: Multi-Vendor Interaction Models", [
                    "To prevent single-point failures, the infrastructure supports federated API dispatching. Ingested compliance items are processed across multiple independent model endpoints (Groq, Anthropic, and local Llama instances) using an automated model routing layer."
                ])
            ],
            "table": None
        },
        # c) Audit Logs
        {
            "category": "audit_logs",
            "filename": "signed_audit_trail.pdf",
            "title": "System Integration Audit Log & Verification Trail",
            "metadata": {
                "Document ID": "AUDIT-TRAIL-SECURE-990",
                "Version": "1.0 (Signed)",
                "Date": "May 2026",
                "Author": "Onyx Automated Security Auditor"
            },
            "sections": [
                ("Section 1: Verification Scope", [
                    "This audit log captures the precise execution sequence of the Onyx Intelligence Engine, tracking the file parsing, token auth, and department routing actions performed by AI Crew agents."
                ]),
                ("Section 2: Chronological Event Logs", [
                    "Below is the chronological log of system operations verified during the latest compliance scan."
                ])
            ],
            "table": [
                ["Timestamp", "Agent Subsystem", "Action Performed", "Security Status"],
                ["01:04:12", "Crawler-01", "Parsed rbi_circular_77.pdf from index", "SEC-200 (Success)"],
                ["01:04:15", "Analyst-02", "Extracted 3 compliance action points", "SEC-201 (Success)"],
                ["01:04:22", "Router-04", "Assigned MAP-101 to IT Security department", "SEC-204 (Success)"],
                ["01:04:25", "Vault-01", "Encrypted & stored ledger payload in database", "SEC-208 (Success)"]
            ],
            "extra_sections": [
                ("Section 3: Cryptographic Signature", [
                    "This log has been cryptographically signed and sealed using the Onyx Certificate Authority root key. Any modifications to this document will invalidate its digital signature check."
                ])
            ]
        }
    ]

    manifest_data = {}
    print(f"{BOLD}{CYAN}=== Generating PDF Assets ==={RESET}")
    
    for doc in documents:
        category = doc["category"]
        filename = doc["filename"]
        title = doc["title"]
        metadata = doc["metadata"]
        sections = doc["sections"]
        
        # Append extra sections if present
        if "extra_sections" in doc:
            sections = sections + doc["extra_sections"]
            
        table_data = doc.get("table")
        
        destination_path = os.path.join(dirs[category], filename)
        doc_id = metadata["Document ID"]
        
        try:
            create_pdf(
                filepath=destination_path,
                title=title,
                metadata=metadata,
                sections=sections,
                table_data=table_data
            )
            
            # Retrieve File Size in KB
            file_size_kb = round(os.path.getsize(destination_path) / 1024, 2)
            
            print(f"{GREEN}[SUCCESS]{RESET} Generated: {filename}")
            print(f"  - Document ID: {doc_id}")
            print(f"  - Size: {file_size_kb} KB")
            print(f"  - Destination: {destination_path}")
            print()
            
            # Map path relative to backend folder
            rel_path = f"assets/{category}/{filename}"
            manifest_data[doc_id] = {
                "title": title,
                "category": category,
                "filename": filename,
                "relative_path": rel_path
            }
            
        except Exception as e:
            print(f"{RED}[ERROR] Failed to compile: {filename}{RESET}")
            traceback.print_exc()
            print()
            
    # 3. Save / Update Manifest
    update_manifest(assets_dir, manifest_data)

if __name__ == "__main__":
    main()
