require_relative '../context/slot'
require_relative '../context/action_builder'
require_relative '../context/slots'

module Factories
  class Slots
    class << self
      def create(actions_hashes, players)
        slots_list = Factories::Slots.create_list(actions_hashes, players)
        ::Slots.new(slots_list, players)
      end

      def create_list(actions_hashes, players)
        slots = {}
        return slots if actions_hashes.empty?

        actions_hashes.each{ |action_hash|
          slot_key = action_hash[:slot]

          slots[slot_key] ||= Slot.new
          slots[slot_key].add(create_action(
            action_hash,
            slot_key,
            get_player(players, action_hash)
          ))
        }
        slots
      end

      private
      def create_action(params, slot_key, player)
        ActionBuilder.new()
          .for(player)
          .at(slot_key)
          .parameterized_with(params)
          .build()
      end

      def get_player(players, action_hash)
        players[action_hash[:player]]
      end
    end
  end
end
