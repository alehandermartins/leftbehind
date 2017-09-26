module LB
  class Action::Escape < Action::Base
    include Cooperative
    include Alien
    include EndGame

    def run context
      super context
      payload[:location] = '8'

      return @context if computed?
      return @context if devoured?

      escape = lambda do |action|

        unless has_helmet? action.performer
          action.add_status :fail
          action.add_info reason: 'action.escape.result.helmet_needed'
          return @context
        end

        if action.performer.trapped?
          action.add_status :fail
          action.add_info reason: 'action.escape.result.shuttle_left'
          return @context
        end

        unless shuttle_is_ready
          action.add_status :fail
          action.add_info reason: 'action.work.result.broken_shuttle'
          return @context
        end

        action.add_status :success
        action.performer.escape
        trap_everybody
      end

      run_multiple escape

      @context
    end

    def run_multiple action_block
      same_actions.each do |the_action|
        next escaped_action(the_action) if the_action.performer.escaped?
        action_block.call(the_action)
      end

      @context
    end

    def trap_everybody
      @context.slots[slot].actions.each do |the_action|
        unless ((the_action.class.name == self.class.name) && (has_helmet? the_action.performer))
          the_action.performer.trap if the_action.performer.status == :alive
          if the_action.class.name == 'LB::Action::Work'
            the_action.add_status :fail
            the_action.add_info(reason: 'action.escape.result.shuttle_left')
            the_action.performer.information.add_to the_action.performer.uuid, slot, the_action.information('LB::Action::Work', true)
          end
        end
      end
    end

    def resolve context
      super context

      performer.information.add_to performer.uuid, slot, information(self.class.name, true)
      @context
    end

    def has_helmet? player
      player.inventory[:helmet] > 0
    end

    def shuttle_is_ready
      @context.items['escape shuttle'][:fix] == 0
    end
  end
end
