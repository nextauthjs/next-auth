[33mcommit 7a1d7120965a01ba23e62277989f4032aa9c9916[m[33m ([m[1;36mHEAD -> [m[1;32mcanary[m[33m, [m[1;33mtag: v3.2.0-canary.14[m[33m, [m[1;31morigin/canary[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Mon Jan 4 22:53:02 2021 +0100

    fix: use authorizationUrl correctly

[33mcommit f7ff4c9219992ceaa73e84f2a8c6723c5f8291bc[m[33m ([m[1;33mtag: v3.2.0-canary.13[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Mon Jan 4 22:20:15 2021 +0100

    fix: trigger release

[33mcommit 20f40d027ae28dec5ab43e878a01d44a6e161e68[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Mon Jan 4 22:16:42 2021 +0100

    refactor: code base improvements 2 (#1045)

[33mcommit b5384e74038ba03bfda91f58a9e3ff29a256f868[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Mon Jan 4 20:30:41 2021 +0100

    docs: misc improvements [skip release] (#1043)

[33mcommit b5c4e91f173716c6f59611801b156d63fd5397d2[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Sun Jan 3 23:18:46 2021 +0100

    chore: run tests on canary [skip release]

[33mcommit f1f144951a01d421dea3a52c446dd4ad68a49227[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Sun Jan 3 13:40:48 2021 +0100

    docs: add powered by vercel logo [skip release]

[33mcommit 0380edfae930ef9a4f6db5c873d492a240afda9a[m[33m ([m[1;33mtag: v3.2.0-canary.12[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Sat Jan 2 21:45:20 2021 +0100

    fix: don't chain on res.end on non-chainable res methods (#1031)

[33mcommit 4d89b27784431afb37d7951ee0fc0c567c44f689[m[33m ([m[1;33mtag: v3.2.0-canary.11[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Sat Jan 2 21:28:54 2021 +0100

    fix: miscellaneous bugfixes (#1030)
    
    * fix: use named params to fix order
    
    * fix: avoid recursive redirects
    
    * fix: revert to use parsed baseUrl
    
    * fix: avoid recursive res.end calls
    
    * fix: use named params in renderPage
    
    * fix: promisify lib/oauth/callback result

[33mcommit e17acb676212322c29bcc77dfa2ccb831d60ad01[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Sat Jan 2 17:57:33 2021 +0100

    chore: rename labeler.yaml to labeler.yml [skip release]

[33mcommit 91e26ca47585440db92e9e39d5a85a6b13e98a67[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Fri Jan 1 23:05:13 2021 +0100

    chore: add auto labeling to PRs [skip release] (#1025)
    
    * chore: add auto labeling to PRs [skip release]
    
    * chore: allow any file type for test label to be added

[33mcommit c8e76b4b5d8fbd1539053069524f9b8751cb568f[m[33m ([m[1;33mtag: v3.2.0-canary.10[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Fri Jan 1 21:49:27 2021 +0100

    feat: forward id_token to jwt and signIn callbacks (#1024)

[33mcommit a8362ec380de6d207e1da9406051e422787d0aea[m[33m ([m[1;33mtag: v3.2.0-canary.9[m[33m)[m
Author: Didi Keke <nyedidikeke@users.noreply.github.com>
Date:   Fri Jan 1 18:05:21 2021 +0000

    feat(provider): Add Mail.ru OAuth Service Provider and Callback snippet (#522)
    
    * Update callback.js
    
    - Fix Mail.ru bug (missing request parameter: access_token)
    
    Note: setGetAccessTokenProfileUrl should be added to Mail.ru provider to enable support.
    
    * Add Mail.ru OAuth Service Provider
    
    * Update callbacks.md
    
    - Fix broken callbacks snippet.
    
    * Update callback.js
    
    - Bug fix https://github.com/nextauthjs/next-auth/pull/522#issuecomment-669851914
    - Minor refactoring.
    
    * Fix: Code linting.
    
    * Update callback.js
    
    Improve approach for building of URL based review recommendation.
    
    * Feat: Reduce API surface expansion
    
    Make use of provider.id === "mailru" as suggested in review discussion in place of setGetAccessTokenProfileUrl.
    
    * Fix: Code linting

[33mcommit f2ad69358fb6e650035c85d320440468d0286377[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Fri Jan 1 14:53:06 2021 +0100

    refactor: code base improvements (#959)
    
    * chore: fix casing of OAuth
    
    * refacotr: simplify default callbacks lib file
    
    * refactor: use native URL instead of string concats
    
    * refactor: move redirect to res.redirect, done to res.end
    
    * refactor: move options to req
    
    * refactor: improve IntelliSense, name all functions
    
    * fix(lint): fix lint errors
    
    * refactor: remove jwt-decode dependency
    
    * refactor: refactor some callbacks to Promises
    
    * revert: "refactor: use native URL instead of string concats"
    
    Refs: 690c55b04089e4f3157424c816d43ee4cecb77a0
    
    * chore: misc changes
    
    Co-authored-by: Balazs Orban <balazs@nhi.no>

[33mcommit ca069764228b9c0414fc350dfa70eb0a2275e05b[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Fri Jan 1 13:43:19 2021 +0100

    docs: fix typos in CONTRIBUTING.md [skip release]

[33mcommit 7fa42753407ea8c1ce67218c06f7a5ae4c40f3a5[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Fri Jan 1 13:37:46 2021 +0100

    docs: update contributing information [skip release] (#1011)
    
    * docs: update CONTRIBUTING.md
    
    * docs:  use db instead of database for more space
    
    * docs: update CONTRIBUTING.md
    
    * docs: update PR template
    
    * docs: add note about skipping a release

[33mcommit c684336b32e7e06b1adf5db801eb9ed23df3e9c3[m[33m ([m[1;33mtag: v3.2.0-canary.8[m[33m)[m
Author: Melanie Seltzer <melleh11@gmail.com>
Date:   Fri Jan 1 04:11:49 2021 -0800

    docs: small update to sign in/out examples (#1016)
    
    * Update examples in client.md
    
    * Update more examples
    
    Co-authored-by: Balázs Orbán <info@balazsorban.com>

[33mcommit 82d16e6ac4773d8d9e97ec08822bb061a785ecf2[m[33m ([m[1;33mtag: v3.2.0-canary.7[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Thu Dec 31 21:55:30 2020 +0100

    feat: allow to return string in signIn callback (#1019)

[33mcommit bf7efbc252801a7cdb2c08915d1c26c25c33dd77[m[33m ([m[1;33mtag: v3.2.0-canary.6[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Thu Dec 31 12:16:03 2020 +0100

    docs: Remove unnecessary promises (#915)

[33mcommit b9862b86b5ef1fc6096d0a5ad2eb7eea98d43c8c[m[33m ([m[1;33mtag: v3.2.0-canary.5[m[33m)[m
Author: Florian Michaut <florianmichaut@gmail.com>
Date:   Thu Dec 31 10:26:26 2020 +0100

    feat(db): make Fauna DB collections & indexes configurable (#968)
    
    * Add collections & indexes overrides for Fauna DB
    
    * Fix the name of the verification token index
    
    Co-authored-by: Florian Michaut <florian@coding-days.com>

[33mcommit 9b579b5fcbb8931ee3ebe8e75d97fdc93a5535cc[m
Author: Ben West <Xodarap@users.noreply.github.com>
Date:   Wed Dec 30 21:25:10 2020 -0800

    Change image to text from varchar (#777)
    
    Co-authored-by: Nico Domino <yo@ndo.dev>

[33mcommit abcf845ebfe7fae2c493a0d83b31a4b22365959f[m[33m ([m[1;33mtag: v3.2.0-canary.4[m[33m)[m
Author: Yuma Matsune <yuma.matsune@gmail.com>
Date:   Thu Dec 31 05:08:09 2020 +0900

    fix(adapter): use findOne for typeorm (#1014)

[33mcommit ee398d1acd3b5fde6e57653f96a328444c2f8919[m[33m ([m[1;33mtag: v3.2.0-canary.3[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Wed Dec 30 14:23:59 2020 +0100

    fix: treat user.id as optional param (#1010)

[33mcommit c31cbbcd30a6ce6e27729695f3b8453fe5c4bdd7[m[33m ([m[1;33mtag: v3.2.0-canary.2[m[33m)[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Tue Dec 29 23:02:07 2020 +0100

    chore(release): trigger release on docs type

[33mcommit 1728f509526c7bbf2e25f6db89f85ba65f5a4567[m
Author: Balázs Orbán <info@balazsorban.com>
Date:   Tue Dec 29 22:51:00 2020 +0100

    chore(release): delete old workflow

[33mcommit 2eb17cba1a90e2acd0b7a995ec3e04d64fb470c5[m
Author: Junior Vidotti <jrvidotti@gmail.com>
Date:   Tue Dec 29 17:49:38 2020 -0400

    docs(database): add mssql indexes in docs, fix typos (#925)
    
    * added mssql indexes in docs, fixed typo
    
    * do