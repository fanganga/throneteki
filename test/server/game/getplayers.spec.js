import Game from '../../../server/game/game.js';

describe('Game', function () {
    function createPlayerSpy(props) {
        let spy = jasmine.createSpyObj(props.name, ['isSpectator', 'isPlaying']);
        spy.isPlaying.and.returnValue(true);
        Object.assign(spy, { id: props.id, firstPlayer: props.firstPlayer });
        return spy;
    }

    beforeEach(function () {
        this.gameService = jasmine.createSpyObj('gameService', ['save']);
        this.game = new Game({ owner: {} }, { gameService: this.gameService });

        this.notSetPlayer1 = createPlayerSpy({ id: '1', name: 'test' });
        this.notSetPlayer2 = createPlayerSpy({ id: '2', name: 'test2' });
        this.setFalsePlayer1 = createPlayerSpy({ id: '1', name: 'test', firstPlayer: false });
        this.setFalsePlayer2 = createPlayerSpy({ id: '2', name: 'test2', firstPlayer: false });
        this.setPlayer1 = createPlayerSpy({ id: '1', name: 'test', firstPlayer: true });
        this.setPlayer2 = createPlayerSpy({ id: '2', name: 'test2', firstPlayer: true });
    });

    describe('getPlayersInFirstPlayerOrder()', function () {
        describe('when there are no players', function () {
            beforeEach(function () {
                this.players = this.game.getPlayersInFirstPlayerOrder();
            });

            it('should return an empty list', function () {
                expect(this.players.length).toBe(0);
            });
        });

        describe('when there is one player', function () {
            describe('and first player is not set yet', function () {
                beforeEach(function () {
                    this.game.playersAndSpectators['test1'] = this.notSetPlayer1;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return the player', function () {
                    expect(this.players[0]).toBe(this.notSetPlayer1);
                });
            });

            describe('and the first player is set', function () {
                beforeEach(function () {
                    this.game.playersAndSpectators['test1'] = this.setPlayer1;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return the player', function () {
                    expect(this.players[0]).toBe(this.setPlayer1);
                });
            });
        });

        describe('when there are two players', function () {
            describe('and first player is not set', function () {
                beforeEach(function () {
                    this.game.playersAndSpectators['test1'] = this.notSetPlayer1;
                    this.game.playersAndSpectators['test2'] = this.notSetPlayer2;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return the players in key order', function () {
                    expect(this.players[0]).toBe(this.notSetPlayer1);
                    expect(this.players[1]).toBe(this.notSetPlayer2);
                });
            });

            describe('when player 1 is first player', function () {
                beforeEach(function () {
                    this.game.playersAndSpectators['test1'] = this.setPlayer1;
                    this.game.playersAndSpectators['test2'] = this.notSetPlayer2;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return player 1 then player 2', function () {
                    this.game.playersAndSpectators['test1'] = this.setPlayer1;
                    expect(this.players[0]).toBe(this.setPlayer1);
                    expect(this.players[1]).toBe(this.notSetPlayer2);
                });
            });

            describe('when player 2 is first player', function () {
                beforeEach(function () {
                    this.game.playersAndSpectators['test1'] = this.notSetPlayer1;
                    this.game.playersAndSpectators['test2'] = this.setPlayer2;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return player 2 then player 1', function () {
                    expect(this.players[0]).toBe(this.setPlayer2);
                    expect(this.players[1]).toBe(this.notSetPlayer1);
                });
            });

            describe('when player 2 is first player and player 1 is explicitly not first player', function () {
                beforeEach(function () {
                    this.game.playersAndSpectators['test1'] = this.setFalsePlayer1;
                    this.game.playersAndSpectators['test2'] = this.setPlayer2;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return player 2 then player 1', function () {
                    expect(this.players[0]).toBe(this.setPlayer2);
                    expect(this.players[1]).toBe(this.setFalsePlayer1);
                });
            });
        });

        describe('when there are more than two players', function () {
            beforeEach(function () {
                this.player1 = createPlayerSpy({ id: '1', name: 'test1', firstPlayer: false });
                this.player2 = createPlayerSpy({ id: '2', name: 'test2', firstPlayer: false });
                this.player3 = createPlayerSpy({ id: '3', name: 'test1', firstPlayer: false });

                this.game.playersAndSpectators['test1'] = this.player1;
                this.game.playersAndSpectators['test2'] = this.player2;
                this.game.playersAndSpectators['test3'] = this.player3;
            });

            describe('and there is no first player', function () {
                it('should return the players in default order', function () {
                    expect(this.game.getPlayersInFirstPlayerOrder()).toEqual([
                        this.player1,
                        this.player2,
                        this.player3
                    ]);
                });
            });

            describe('and the first player in the list is first player', function () {
                beforeEach(function () {
                    this.player1.firstPlayer = true;
                });

                it('should return the players in correct order', function () {
                    expect(this.game.getPlayersInFirstPlayerOrder()).toEqual([
                        this.player1,
                        this.player2,
                        this.player3
                    ]);
                });
            });

            describe('and the last player in the list is first player', function () {
                beforeEach(function () {
                    this.player3.firstPlayer = true;
                });

                it('should return the players in correct order', function () {
                    expect(this.game.getPlayersInFirstPlayerOrder()).toEqual([
                        this.player3,
                        this.player1,
                        this.player2
                    ]);
                });
            });

            describe('and a middle player in the list is first player', function () {
                beforeEach(function () {
                    this.player2.firstPlayer = true;
                });

                it('should return the players in clockwise order', function () {
                    expect(this.game.getPlayersInFirstPlayerOrder()).toEqual([
                        this.player2,
                        this.player3,
                        this.player1
                    ]);
                });
            });
        });
    });
});
