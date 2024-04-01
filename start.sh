#!/bin/bash
gunicorn -b :5000 server:app