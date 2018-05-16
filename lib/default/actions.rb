module LB
  module Default
    class Actions
      class << self
        def eating_action
          {
            'eating' => {
              name: 'eat',
              payload: {
                resource: 'food'
              }
            }
          }
        end

        def dead_actions
          {
            'morning' => {
              name: 'playdead',
              payload: {}
            },
            'afternoon' => {
              name: 'playdead',
              payload: {}
            },
            'evening' => {
              name: 'playdead',
              payload: {}
            },
            'midnight' => {
              name: 'playdead',
              payload: {}
            }
          }
        end

        def dead_events
          {
            'events' => {
              name: 'playdead',
              payload: {}
            }
          }
        end

        def dead_eating
          {
            'eating' => {
              name: 'playdead',
              payload: {}
            }
          }
        end

        def default_actions
          {
            actions: {
              'morning' => {
                name: 'none',
                payload: {}
              },
              'afternoon' => {
                name: 'none',
                payload: {}
              },
              'evening' => {
                name: 'none',
                payload: {}
              },
              'midnight' => {
                name: 'none',
                payload: {}
              }
            },
            voting: {
              'events' => {
                name: 'vote',
                payload: {
                  target: []
                }
              }
            },
            fusion: {
              'events' => {
                name: 'fusion',
                payload: {
                  decision: 'false'
                }
              }
            },
            inject: {
              'events' => {
                name: 'inject',
                payload: {
                  decision: 'false'
                }
              }
            },
            android: {
              'events' => {
                name: 'android',
                payload: {
                  decision: 'false'
                }
              }
            },
            betray: {
              'events' => {
                name: 'betray',
                payload: {
                  decision: 'false'
                }
              }
            },
            defaultEvent: {
              'events' => {
                name: 'none',
                payload: {}
              }
            }
          }
        end
      end
    end
  end
end
