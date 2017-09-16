require_relative '../lib/util'
module Repos
  class ActionsInMemory
    class << self

      def for db
      end

      def actions_collection
        @@collection ||= []
      end

      def clear
        actions_collection.clear
      end

      def save data
        string_indexed_data = data.map { |d|
          Hash[d.map do |k,v|
            [k.to_s, v]
          end]
        }
        actions_collection.push(*string_indexed_data)
      end

      def remove game, player, slot
        actions_collection.delete_if { |e|
          e['game'] == game && e['player'] == player && e['slot'] == slot
        }
      end

      def grab  game
        results = actions_collection.select{ |e| e['game'] == game }

        results.map { |action|
          Util.string_keyed_hash_to_symbolized action
        }
      end

      def grab_for player, game
        results = actions_collection.select{ |e| e['game'] == game && e['player'] == player }

        results.map { |action|
          Util.string_keyed_hash_to_symbolized action
        }
      end
    end
  end
end
