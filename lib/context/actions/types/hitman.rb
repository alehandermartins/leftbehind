module LB
  class Action::Hitman < Action::Base
    include Cooperative

    def run context
      super context
      return @context if computed?

      betrayer_action = same_actions.detect { |action|
        action.performer.sidequest == :betrayer
      }

      betrayed_action = same_actions.detect { |action|
        action.performer.uuid == betrayer_action.performer.target
      }

      peace_result betrayer_action, betrayed_action
      surrender_result betrayer_action, betrayed_action
      killing_result betrayer_action, betrayed_action
      giveaway_result betrayer_action, betrayed_action

      add_event_to_everyone :hitman

      @context
    end

    def resolve context
      super context

      performer.information.add_action(performer.uuid, slot, information)
      @context
    end

    private
    def peace? betrayer_action, betrayed_action
      betrayer_action.payload[:decision] == false && betrayed_action.payload[:decision] == false
    end

    def peace_result betrayer_action, betrayed_action
      return unless peace?(betrayer_action, betrayed_action)
      betrayer_action.add_status :fail
      betrayed_action.add_status :success
      add_outcome betrayer_action, betrayed_action, 'peace'
    end

    def surrender? betrayer_action, betrayed_action
      betrayer_action.payload[:decision] == true && betrayed_action.payload[:decision] == true
    end

    def surrender_result betrayer_action, betrayed_action
      return unless surrender?(betrayer_action, betrayed_action)
      betrayer_action.add_status :success
      betrayed_action.add_status :fail
      betrayer_action.performer.code = true
      add_outcome betrayer_action, betrayed_action, 'surrender'
      log_to_everyone betrayer_action.performer, { action: self.class.name, result: { info: { reason: 'action.hitman.result.warning', target: betrayed_action.performer.uuid } } }
    end

    def killing? betrayer_action, betrayed_action
      betrayer_action.payload[:decision] == true && betrayed_action.payload[:decision] == false
    end

    def killing_result betrayer_action, betrayed_action
      return unless killing?(betrayer_action, betrayed_action)
      betrayer_action.add_status :fail
      betrayed_action.add_status :fail
      betrayed_action.performer.status = :murdered
      betrayer_action.performer.add_trait :murderer
      add_outcome betrayer_action, betrayed_action, 'killing'
      log_to_everyone betrayer_action.performer, { action: self.class.name, result: { info: { reason: 'action.hitman.result.warning2', target: betrayed_action.performer.uuid } } }
    end

    def giveaway? betrayer_action, betrayed_action
      betrayer_action.payload[:decision] == false && betrayed_action.payload[:decision] == true
    end

    def giveaway_result betrayer_action, betrayed_action
      return unless giveaway?(betrayer_action, betrayed_action)
      betrayer_action.add_status :success
      betrayed_action.add_status :fail
      betrayer_action.performer.code = true
      add_outcome betrayer_action, betrayed_action, 'giveaway'
      log_to_everyone betrayer_action.performer, { action: self.class.name, result: { info: { reason: 'action.hitman.result.warning', target: betrayed_action.performer.uuid } } }
    end

    def add_outcome betrayer_action, betrayed_action, outcome
      betrayer_action.add_info reason: 'action.hitman.result.' + outcome
      betrayer_action.add_info target: betrayed_action.performer.uuid

      betrayed_action.add_info reason: 'action.hitman.result.' + outcome + '2'
      betrayed_action.add_info target: betrayer_action.performer.uuid
    end
  end
end