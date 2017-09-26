module LB
  class Action::Defend < Action::Base

    def run context
      super context

      return @context if computed?

      add_status :success
      add_info attackers: attackers
      add_failure_to_attackers
      @context
    end

    def resolve context
      super context

      performer.information.add_to performer.uuid, slot, information(self.class.name, true)
      @context
    end

    private
    def attackers
      @context.slots[slot].actions.map { |the_action|
        attack_info the_action if targeted_performer? the_action
      }.compact
    end

    def add_failure_to_attackers
      @context.slots[slot].actions.each do |the_action|
        if targeted_performer? the_action
          the_action.add_status :fail
          the_action.add_info reason: 'action.defend.result.attack_defended';
          the_action.performer.information.add_to performer.uuid, slot, defender_info(the_action)
          performer.information.add_to the_action.performer.uuid, slot, attacker_info(the_action)
        end
      end
    end

    def attack_info the_action
      {
        action: the_action.class.name,
        performer: the_action.performer.uuid,
        payload: the_action.payload,
      }
    end

    def attacker_info the_action
      {
        action: the_action.class.name,
        payload: the_action.payload,
        result: the_action.result,
        inventory: nil
      }
    end

    def defender_info attack_action
      {
        action: self.class.name,
        payload: payload,
        result: {
          info: {
            attackers: [
              attack_info(attack_action)
            ]
          }
        },
        inventory: nil
      }
    end

    def targeted_performer? action
      (action.respond_to? :target) && (action.target == performer.uuid) && (same_status? action)
    end

    def same_status? action
      @context.players[action.performer.uuid].status == performer.status
    end
  end
end
