describe 'Work' do

  let(:game_id){'deadbeef'}
  let(:player_hash){
    {
      'name' => 'player_name',
      'uuid' => 'player'
    }
  }
  let(:otter_player_hash){
    {
      'name' => 'otter_player_name',
      'uuid' => 'otter'
    }
  }
  let(:work_action_hash){
    {
      'morning' => {
        'name' => 'work',
        'payload' => {
          'item' => 'escape shuttle',
          'label' => 'Repair the escape shuttle'
        }
      }
    }
  }

  before(:each){

    db['games'].insert_one({
      name: 'test_game',
      uuid: game_id
    })

    Services::Games.add_player game_id, player_hash['uuid'], player_hash['name']
    Services::Games.add_player game_id, otter_player_hash['uuid'], otter_player_hash['name']
  }

  describe 'Alone Work' do

    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], work_action_hash

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @one_action = @initial_context.slots[1].actions.first
    }

    context 'when team has resources' do
      it 'they take precedence' do
        @initial_context.team.inventory.add :parts, 2
        @player.inventory.add :parts, 1

        expect(@initial_context.team.inventory).to receive(:subtract).once.and_call_original
        expect(@player.inventory).not_to receive(:subtract)

        @one_action.run @initial_context
      end
    end
    context 'when a team doesn\'t have resources' do
      context 'and the player has' do
        it 'resources are taken from player' do
          @player.inventory.add :parts, 1

          expect(@initial_context.team.inventory).not_to receive(:subtract)
          expect(@player.inventory).to receive(:subtract)

          @one_action.run @initial_context
        end
      end
      context 'and the player does not have' do
        it 'the action fails' do
          expect(@initial_context.team.inventory).not_to receive(:subtract)
          expect(@player.inventory).not_to receive(:subtract)

          derived_context = @one_action.run @initial_context

          expect(@one_action.status).to eq(:fail)
          @one_action.resolve derived_context
          expect(@player.information['player'][1][:result][:info]).to eq(reason: 'action.work.result.no_fixing_materials')
        end
      end
    end
    context 'when the item is not completely fixed' do
      it 'fixes the item' do
        @player.inventory.add :parts, 1
        derived_context = @one_action.run @initial_context
        derived_context = @one_action.resolve derived_context
        expect(derived_context.items['escape shuttle'][:fix]).to eq(9)
      end
    end

    context 'when the item is already fixed' do
      it 'does nothing' do
        allow(@initial_context.items['escape shuttle']).to receive(:[]).with(:fix).and_return(0)
        @player.inventory.add :parts, 1

        derived_context = @one_action.run @initial_context
        derived_context = @one_action.resolve derived_context
        expect(@player.inventory[:parts]).to eq(1)
        expect(@one_action.status).to eq(:fail)
        expect(@player.information['player'][1][:result][:info]).to eq(reason: 'action.work.result.already_fixed')
      end
    end
  end


  describe 'Cooperative work' do


    before(:each){

      Services::Actions.send :save, game_id, player_hash['uuid'], work_action_hash
      Services::Actions.send :save, game_id, otter_player_hash['uuid'], work_action_hash

      @initial_context = Context.build_for game_id
      @player = @initial_context.players['player']
      @otter = @initial_context.players['otter']
      @one_action = @initial_context.slots[1].actions.first
      @otter_action = @initial_context.slots[1].actions.last
    }

    it 'handles cooperative situations' do
      derived_context = @one_action.run @initial_context
      derived_context = @otter_action.run derived_context

      expect(@otter_action).not_to receive(:run_multiple)
    end

    it 'computes all cowork actions in the same slot' do
      expect(@one_action).to receive(:run_multiple).and_call_original

      derived_context = @one_action.run @initial_context
      expect(derived_context.slots[1].actions).to all be_computed
    end

    context 'cowork actions are computed attending to player "richness"' do
      context 'when team has resources' do
        it 'they take precedence' do
          @initial_context.team.inventory.add :parts, 2
          @player.inventory.add :parts, 1
          @otter.inventory.add :parts, 1

          expect(@initial_context.team.inventory).to receive(:subtract).twice.and_call_original
          expect(@player.inventory).not_to receive(:subtract)
          expect(@otter.inventory).not_to receive(:subtract)

          @one_action.run @initial_context
        end
      end

      context 'when team doesn\'t have enough resources' do
        it 'their are taken from both places' do
          @initial_context.team.inventory.add :parts, 1
          @otter.inventory.add :parts, 1

          expect(@initial_context.team.inventory).to receive(:subtract).and_call_original
          expect(@otter.inventory).to receive(:subtract).and_call_original
          expect(@player.inventory).not_to receive(:subtract)

          @one_action.run @initial_context
        end
      end

      context 'when a team doesn\'t have resources' do
        it 'resources are taken from players' do
          @player.inventory.add :parts, 1
          @otter.inventory.add :parts, 1

          expect(@initial_context.team.inventory).not_to receive(:subtract)
          expect(@player.inventory).to receive(:subtract)
          expect(@otter.inventory).to receive(:subtract)

          @one_action.run @initial_context
        end
      end
    end
  end
end
