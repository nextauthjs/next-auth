CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `emailVerified` varchar(24) NULL DEFAULT NULL,
  `image` text,
  PRIMARY KEY (`id`)
);

CREATE TABLE `sessions` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `expires` varchar(24) NOT NULL,
  `sessionToken` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_userid_foreign` (`userId`),
  CONSTRAINT `sessions_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `accounts` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `providerAccountId` varchar(255) NOT NULL,
  `refresh_token` text,
  `access_token` text,
  `expires_at` bigint DEFAULT NULL,
  `id_token` text,
  `scope` text,
  `session_state` text,
  `token_type` text,
  PRIMARY KEY (`id`),
  KEY `accounts_userid_foreign` (`userId`),
  CONSTRAINT `accounts_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `verification_token` (
  `identifier` varchar(256) NOT NULL,
  `expires` varchar(24) NOT NULL,
  `token` varchar(256) NOT NULL,
  PRIMARY KEY (`identifier`,`token`)
)