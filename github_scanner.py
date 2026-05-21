import requests
from config import GITHUB_TOKEN
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urlparse

def scan_github_repo(repo_url: str) -> dict:
    """Clones repo, runs bandit and safety, returns results."""
    results = {"dependencies": [], "secrets": [], "bandit_issues": []}
    parsed = urlparse(repo_url)
    path_parts = [part for part in parsed.path.strip("/").split("/") if part]
    if parsed.scheme != "https" or parsed.netloc.lower() != "github.com" or len(path_parts) < 2:
        return {"error": "Only HTTPS GitHub repository URLs are supported."}

    repo_path = "/".join(path_parts[:2])
    normalized_url = f"https://github.com/{repo_path}.git"
    api_url = f"https://api.github.com/repos/{repo_path}/dependencies"
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    try:
        resp = requests.get(api_url, headers=headers, timeout=10)
        if resp.status_code == 200:
            results["dependencies"] = resp.json().get("dependencies", [])
    except Exception as e:
        results["dependencies_error"] = str(e)

    # Clone and run bandit + safety
    with tempfile.TemporaryDirectory() as tmpdir:
        clone_dir = Path(tmpdir) / "repo"
        try:
            subprocess.run(
                ["git", "clone", "--depth", "1", normalized_url, str(clone_dir)],
                check=True,
                timeout=30,
            )
            bandit_out = subprocess.run(
                ["bandit", "-r", str(clone_dir), "-f", "json"],
                capture_output=True,
                text=True,
            )
            if bandit_out.returncode != 0 and "No issues found" not in bandit_out.stderr:
                results["bandit_issues"] = bandit_out.stdout
            safety_out = subprocess.run(
                ["safety", "check", "--json"],
                capture_output=True,
                text=True,
                cwd=clone_dir,
            )
            if safety_out.stdout:
                results["safety_vulns"] = safety_out.stdout
        except Exception as e:
            results["scan_error"] = str(e)
    return results
