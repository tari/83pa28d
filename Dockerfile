FROM debian
RUN apt-get -qqy update && apt-get -qqy install --no-install-recommends pandoc ghc libghc-pandoc-types-dev alex make \
    && apt-get -qqy clean && rm -rf /var/lib/apt/lists/*
