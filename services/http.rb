module Services

	class Http
		 class << self

		 		def notify uuids, game
		 			return unless BaseController.settings.onesignal
	 				players = Repos::Users.player_ids(uuids)
	 			 	params = {
				    "app_id" => BaseController.settings.onesignal["app_id"],
				    "contents" => {"en" => "Next phase is ready"},
				    "url" => "http://beta.leftbehind.xyz/play/#{game}",
				    "include_player_ids" => players
				  }

				  parsed_url = URI.parse(BaseController.settings.onesignal["uri"])
				  req = Net::HTTP::Post.new(parsed_url.path,
				                              'Content-Type'  => 'application/json;charset=utf-8',
				                              'Authorization' => "Basic #{BaseController.settings.onesignal["rest_key"]}")
				  http = Net::HTTP.new(parsed_url.host, parsed_url.port)
				  http.use_ssl = (parsed_url.scheme == "https")
				  req.body = params.to_json
				  response = http.request(req)
		 		end
		 end
	end
end