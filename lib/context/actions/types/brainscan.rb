module LB
  class Action::BrainScan < Action::Base
    include WithTarget
    include IA

    def run context
      super context
      payload[:location] = '4'

      return @context if computed?
      return @context if killed?

      if performer.brainscan == 4
        add_status :fail
        add_info reason: 'action.brainscan.result.already_fixed'
        return @context
      end

      if able?
        performer.inventory.subtract :energy, 1
        performer.scan_brain
        add_status :success
        add_info reason: 'action.brainscan.result.success'

        if performer.brainscan == 4
          log_to_everyone(performer, scan_info)
          add_info reason: 'action.brainscan.result.code'
          add_info warning: true 
        end
      end

      add_status :fail
      add_info reason: 'action.brainscan.result.no_fixing_materials'

      @context
    end

    def resolve context
      super context

      add_info brainscan: (performer.brainscan * 100 / 4)
      performer.information.add_action performer.uuid, slot, information

      @context
    end

    private
    def able?
      performer.inventory[:energy] > 0
    end

    def scan_info
      {
        action: self.class.name,
        payload: payload,
        result: {
          info: {
            reason: 'action.brainscan.result.warning',
            warning: true
          } 
        }
      }
    end
  end
end
