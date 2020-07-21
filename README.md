# github-set-net-version
Sets the .net assembly version.

## Example

```yaml
name: Generate
jobs:
  generate:
    steps:
      - uses: actions/checkout@v1
      - name: 'Get Previous tag'
        id: semver
        uses: "cdotyone/github-next-version@master"
        env:
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

