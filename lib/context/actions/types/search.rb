module LB
  class Action::Search < Action::Base
    include Located
    include Cooperative
    include Alien
    include EndGame

    def run context
      super context
      
      return @context if computed?
      return @context if devoured?

      search = lambda do |action|

        action.add_info mates: mates.map(&:uuid)
        action.add_status :success

        if flattened_inventory.empty?
          action.add_bounty bounties

          (cowork_actions).each {|coworker_action|
            coworker_action.performer.information.add_to :locations, location, slot
          }

          return @context
        end
        found = flattened_inventory.sample(random: @context.random_generator)

        bounties[found] += 1
        location_inventory[found] -= 1
        action.add_bounty bounties
      end

      run_multiple search

      @context
    end

    def resolve context
      super context
      return @context unless success?

      if alone?
        performer.inventory.add :food, bounties[:food] if bounties.has_key? :food
        performer.inventory.add :parts, bounties[:parts] if bounties.has_key? :parts
        performer.inventory.add :helmet, bounties[:helmet] if bounties.has_key? :helmet
      else
        @context.team.inventory.add :food, bounties[:food] if bounties.has_key? :food
        @context.team.inventory.add :parts, bounties[:parts] if bounties.has_key? :parts

        if bounties.has_key? :helmet
          cowork_actions.sample(bounties[:helmet], random: @context.random_generator).each do |the_action|
            the_action.performer.inventory.add :helmet, 1

            cowork_actions.each {|coworker_action|
              coworker_action.add_info the_action.performer.uuid => :helmet
            }
          end
          bounties[:helmet] = 0
        end
      end
      cowork_actions.each{ |coworker_action|
        @context.players[performer.uuid].information.add_to(coworker_action.performer.uuid, slot, information(self.class.name, false))
      }
      performer.information.add_to(performer.uuid, slot, information(self.class.name, true))
      @context
    end

    def run_multiple action_block
      cowork_actions.sort_by{ @context.random_generator.random_number }.each do |the_action|
        next escaped_action(the_action) if the_action.performer.escaped?
        action_block.call(the_action)
      end

      @context
    end
  end
end
