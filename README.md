
## Development VM tools
- git curl
- On My Zsh, powerfont
- docker
- nodejs
- microk8s
- skaffold
- kubectl
- k9s

### Run skaffold dev mode
```bash
skaffold dev --profile microk8s
```
### Docker run commands
```bash
docker run \
  --name redis --rm -it \
  -p 6379:6379 \
  redis:7.2
```
