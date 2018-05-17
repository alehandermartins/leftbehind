module LB
  class Action::Gunsmith < Action::Base

    def run context
      super context
      return @context if computed?

      add_status :success if payload[:decision] == true
      add_status :fail if payload[:decision] == false

      @context
    end

    def resolve context
      super context

      performer.add_trait :gunsmith if success?
      select_target
      add_event_to_everyone :gunsmith
      performer.information.add_action(performer.uuid, slot, information)

      @context
    end

    def select_target
      targets = @context.players.alive.select { |player| player != performer }
      no_android_targets = no_android(targets)
      performer.target = no_android_targets.sample(random: @context.random_generator).uuid
    end

    def no_android targets
      return targets if targets.size <= 1
      targets.select { |player| !player.traits.include?(:android) }
    end
  end
end