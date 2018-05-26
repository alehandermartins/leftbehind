module LB
  class Action::Search < Action::Base
    include Located
    include Cooperative
    include IA
    include EndGame
    include WithResource

    def run context
      super context

      return @context if computed?
      return @context if killed?

      search = lambda do |action|

        action.add_info mates: mates.map(&:uuid)
        action.add_status :success

        if flattened_inventory.empty?
          action.add_status :fail
          (cowork_actions).each {|coworker_action|
            coworker_action.performer.information.empty_location location
          }
          return @context
        end

        found = foundable_items_for(action.performer).sample(random: @context.random_generator)

        if found.nil?
          action.add_status :fail
          action.add_bounty Hash[flattened_inventory.first, 1]
          return @context
        end

        location_inventory[found] -= 1
        action.add_bounty Hash[found, 1]
      end

      run_multiple search
      @context
    end

    def resolve context
      super context
      performer.information.add_action(performer.uuid, slot, information)
      return @context unless success?

      performer.inventory.add :helmet, bounty[:helmet] if bounty.has_key? :helmet
      performer.inventory.add :energy, bounty[:energy] if bounty.has_key? :energy
      performer.inventory.add :parts, bounty[:parts] if bounty.has_key? :parts

      @context
    end

    private
    def run_multiple action_block
      cowork_actions.sort_by{ @context.random_generator.random_number }.each do |the_action|
        next escaped_action(the_action) if the_action.performer.escaped?
        action_block.call(the_action)
      end

      @context
    end

    def foundable_items_for player
      unable_items = [:helmet, :parts, :energy].select {|res| unable?(player, res)}
      flattened_inventory.select { |res| !unable_items.include?(res) }
    end

    def unable? player, res
      player.inventory[res] >= resource_capacity(res)
    end
  end
end
