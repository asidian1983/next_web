tmux new-session -d -s ai-dev

tmux split-window -h
tmux split-window -v
tmux split-window -v

tmux select-pane -t 0 -T frontend
tmux select-pane -t 1 -T backend
tmux select-pane -t 2 -T ai
tmux select-pane -t 3 -T infra

tmux attach -t ai-dev