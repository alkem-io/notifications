# Notifications
Alkemio out-of-band notifications service.

[![Build Status](https://app.travis-ci.com/alkem-io/notifications.svg?branch=develop)](https://app.travis-ci.com/alkem-io/notifications.svg?branch=develop)
[![Coverage Status](https://coveralls.io/repos/github/alkem-io/notifications/badge.svg?branch=develop)](https://coveralls.io/github/alkem-io/notifications?branch=develop)
[![Deploy to DockerHub](https://github.com/alkem-io/notifications/actions/workflows/build-release-docker-hub.yml/badge.svg)](https://github.com/alkem-io/notifications/actions/workflows/build-release-docker-hub.yml)

## 
This repository contains two core elements:
* Notifications Service: the docker container that is used to provide the run time service
* Nofications Library: used to provide a shared set of payloads and event types that is then used by both the Notifications Service and clients of the service.

## Email delivery

The service renders its existing templates and sends email through Nodemailer.
SMTP host, port, authentication and TLS settings remain in `notification_providers.email`.
`EMAIL_MULTI_PROVIDER_STRATEGY` keeps these existing modes:

- `fallback`: try SMTP, then log the email if SMTP fails.
- `no-fallback`: try SMTP only and report a transport failure to the existing retry handling.
- `roundrobin`: alternate the first provider between SMTP and the logger, with fallback to the other provider on failure.

The logger provider reports success after logging, as it did previously. Use
`no-fallback` when SMTP delivery is required for a successful result. Subject,
HTML/text, reply-to, recipient fields, headers and attachment bytes pass through
to the mail transport; template rendering and RabbitMQ acknowledgement handling
remain separate.
