#!/bin/bash

SESSION="ai-dev"
ROOT="$(cd "$(dirname "$0")" && pwd)"

# Kill existing session if already running
tmux kill-session -t $SESSION 2>/dev/null

tmux new-session -d -s $SESSION -x 220 -y 50

# Layout: left = frontend, right split into 3 (backend / ai / infra)
tmux split-window -h -t $SESSION:0.0
tmux split-window -v -t $SESSION:0.1
tmux split-window -v -t $SESSION:0.2

# Name panes
tmux select-pane -t $SESSION:0.0 -T "frontend"
tmux select-pane -t $SESSION:0.1 -T "backend"
tmux select-pane -t $SESSION:0.2 -T "ai"
tmux select-pane -t $SESSION:0.3 -T "infra"

# 1) infra: start postgres + redis first
tmux send-keys -t $SESSION:0.3 "cd $ROOT && docker compose up postgres redis" Enter

# 2) brief pause so docker compose can acquire the network before api/ai start
sleep 2

# 3) backend: docker compose handles depends_on health checks automatically
tmux send-keys -t $SESSION:0.1 "cd $ROOT && docker compose up api" Enter

# 4) ai service
tmux send-keys -t $SESSION:0.2 "cd $ROOT && docker compose up ai" Enter

# 5) frontend: run locally with hot reload
tmux send-keys -t $SESSION:0.0 "cd $ROOT/apps/web && npm run dev" Enter

# Focus frontend pane
tmux select-pane -t $SESSION:0.0

tmux attach -t $SESSION
