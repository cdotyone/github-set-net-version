# github-set-net-version
Sets the .net assembly version.

## Example

```yaml
name: Generate
jobs:
  generate:
    steps:
      - uses: actions/checkout@v1
      - name: 'Set .net File Version'
        id: semver
        uses: "cdotyone/github-next-version@main"
```

