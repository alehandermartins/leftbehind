module LB
  module Cooperative

    def mates
      cowork_actions.map { |the_action|
        the_action.performer
      }.compact
    end

    def cowork_actions
      @context.slots[slot].actions.select { |the_action|
        next unless the_action.class == self.class
        next the_action.item == item if self.respond_to? :item
        next the_action.location == location if self.respond_to? :location
        next the_action.target == target if self.respond_to? :target
      }.shuffle(random: @context.random_generator)
    end

    def same_actions
      @context.slots[slot].actions.select { |the_action|
        the_action.class == self.class
      }.shuffle(random: @context.random_generator)
    end
  end
end
