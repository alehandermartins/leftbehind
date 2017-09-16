class BaseController < Sinatra::Base

  helpers do

    def respond_with_json
      content_type :json
    end
    alias_method :json, :respond_with_json

    def success game_id, payload = {}
      respond_with_json
      message = build_message(game_id, payload)
      message.to_json
    end

    def fail! reason = nil
      respond_with_json
      message = build_error reason
      halt message.to_json
    end

    def invalid_name? name
      name.nil? || name.empty?
    end

    def scopify **param_projection
      param_projection.each do |param, projection|
        projection = param if projection == true
        self.send(:define_singleton_method, projection) {
          params[param]
        }
      end
    end
  end

  private

    def strip_invalid_values message
      message.reject{ |key,value| value.nil?}
      message
    end

    def build_message game_id, payload
      message = {status: :success, uuid: game_id}
      message = message.merge payload
    end

    def build_error reason
      error = { status: :fail, reason: reason }
      error = strip_invalid_values error
    end
end
