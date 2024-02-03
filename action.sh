TOKEN=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
REPO=EthanWakeford/personal-homepage
WORKFLOW_ID=62189612

curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$REPO/actions/workflows/$WORKFLOW_ID/dispatches \
  -d '{"ref":"main","inputs":{}}'
