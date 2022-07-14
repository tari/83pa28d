FROM pandoc/core:2-alpine
RUN apk add --no-cache make
ENTRYPOINT ["/bin/sh"]
