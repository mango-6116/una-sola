import { Component, OnInit } from '@angular/core';

export interface GameLevel {
  levelName: string;
  gameString: string;
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {

  currentIndex = -1;
  nextIndex = -1;
  currentGameString: string = '';
  levels: GameLevel[] = [];
  options: any = {};
  stepper = 0;

  ngOnInit() {
    this.setLevels();
    //this.findDupes();
    const lastGameString = localStorage.getItem('lastGameString');
    this.currentGameString = 
      !!lastGameString ?
      lastGameString :
      this.levels[0].gameString;
  }

  findDupes() {
    const duplicateLevels =  [...new Set(this.levels.filter(
      (level, idx, allLevels) => 
        allLevels.findIndex(l => l.gameString === level.gameString) !== idx)
      )];
    console.log('~~~', duplicateLevels);
  }

  resetGameString(ev: any) {
    this.currentGameString = '';
    setTimeout(() => { 
      this.currentGameString = ev;
      this.saveGame();
    });
  }

  nextGameString(ev: any) {
    const refIndex = this.levels.findIndex(r => r.gameString === ev);
    this.stepper = 0;
    if (refIndex !== -1) {
        this.currentGameString =
        refIndex === this.levels.length-1 ?
        this.levels[0].gameString:
        this.levels[refIndex+1].gameString;
        this.saveGame();
    }
  }

  previousGameString(ev: any) {
    const refIndex = this.levels.findIndex(r => r.gameString === ev);
    this.stepper = 0;
    if (refIndex !== -1) {
        this.currentGameString =
        refIndex === 0 ?
        this.levels[this.levels.length-1].gameString:
        this.levels[refIndex-1].gameString;
        this.saveGame();
    }
  }

  changeGame(ev: any) {
    this.currentGameString = ev.target.value;
    this.stepper = 0;
    this.saveGame();
  }

  saveGame() {
    localStorage.setItem('lastGameString', this.currentGameString);
  }

  setGames(ev: GameLevel[]) {
    if (ev.length) {
      this.levels = ev;
    } else {
      this.setLevels();
    }
  }

  getHint() {
    this.stepper++;
  }

  setLevels() {
    this.levels = [
      { levelName: '001 - Easy', gameString: '.R.. ..P. .P.. ....' },
      { levelName: '002 - Easy', gameString: '.... Q..R .... B...' },
      { levelName: '003 - Easy', gameString: '..B. .... B... .R..' },
      { levelName: '004 - Easy', gameString: '.... ..N. N... .R..' },
      { levelName: '005 - Easy', gameString: '.... .QK. R... ....' },
      { levelName: '006 - Easy', gameString: '.NR. .... Q... ....' },
      { levelName: '007 - Easy', gameString: 'N... .... R... B..N' },
      { levelName: '008 - Easy', gameString: 'N.N. ..P. .B.. ....' },
      { levelName: '009 - Easy', gameString: '.R.. B.P. .... R...' },
      { levelName: '010 - Easy', gameString: '.K.. .QP. R... ....' },
      { levelName: '011 - Easy', gameString: 'B..R P... BN.. .N..' },
      { levelName: '012 - Easy', gameString: '...P ..P. .P.. ..R.' },
      { levelName: '013 - Easy', gameString: '.P.P P... ...P Q.P.' },
      { levelName: '014 - Easy', gameString: '..P. .Q.. ...P N...' },
      { levelName: '015 - Easy', gameString: '..N. .B.. P... ..N.' },
      { levelName: '016 - Easy', gameString: '.N.. R.P. .P.. ....' },
      { levelName: '017 - Easy', gameString: '..P. .P.P P.P. .P.P' },
      { levelName: '018 - Easy', gameString: '.... .RPP ..P. ...P' },
      { levelName: '019 - Easy', gameString: '..B. .B.B B.B. .BR.' },
      { levelName: '020 - Easy', gameString: '...N P..P R... .B..' },
      { levelName: '021 - Easy', gameString: '...Q .N.. ..N. Q...' },
      { levelName: '101 - Medium', gameString: '.NRN .... .B.P R...' },
      { levelName: '102 - Medium', gameString: '..P. BNRN ..P. ....' },
      { levelName: '103 - Medium', gameString: 'N..B K... .NB. P...' },
      { levelName: '104 - Medium', gameString: '..N. ..BP .R.B P...' },
      { levelName: '105 - Medium', gameString: '.P.N N.B. .P.. ..R.' },
      { levelName: '106 - Medium', gameString: '..R. ..K. .PN. B..R' },
      { levelName: '107 - Medium', gameString: '.P.. QR.B .P.. R...' },
      { levelName: '108 - Medium', gameString: '..QP .... N.B. .PR.' },
      { levelName: '109 - Medium', gameString: '..QR RN.. ...B B...' },
      { levelName: '110 - Medium', gameString: 'NP.. .B.. B.N. .P..' },
      { levelName: '111 - Medium', gameString: '.N.B ..BR ...P R...' },
      { levelName: '112 - Medium', gameString: 'RK.. ..QB .B.. P...' },
      { levelName: '113 - Medium', gameString: '.RN. Q..N ..R. B...' },
      { levelName: '114 - Medium', gameString: '.PNP ..Q. ..B. R...' },
      { levelName: '115 - Medium', gameString: 'R... B... ..R. PN.N' },
      { levelName: '116 - Medium', gameString: '..P. BRBN ..N. ....' },
      { levelName: '117 - Medium', gameString: '.BRP .... .QB. R...' },
      { levelName: '118 - Medium', gameString: '.P.. NRBB .... P...' },
      { levelName: '119 - Medium', gameString: '.Q.. .BNB ...N R...' },
      { levelName: '120 - Medium', gameString: 'N... RB.N ..R. B...' },
      { levelName: '121 - Medium', gameString: 'P... ..BQ N.N. ..B.' },
      { levelName: '122 - Medium', gameString: '..PP .N.Q ...B R...' },
      { levelName: '123 - Medium', gameString: '.B.. .R.. ..PN R.N.' },
      { levelName: '124 - Medium', gameString: 'P.P. RQB. .... .B..' },
      { levelName: '125 - Medium', gameString: 'N.PB P..N .R.. ....' },
      { levelName: '126 - Medium', gameString: 'RK.. BN.K BB.. R..N' },
      { levelName: '127 - Medium', gameString: 'RN.. BBP. R..P B..R' },
      { levelName: '128 - Medium', gameString: 'RPP. BB.. Q..K ..R.' },
      { levelName: '129 - Medium', gameString: '.B.. ..Q. ...B R...' },
      { levelName: '130 - Medium', gameString: '..R. NP.N .BB. ...P' },
      { levelName: '131 - Medium', gameString: '..B. ...B ..QP NR..' },
      { levelName: '132 - Medium', gameString: '..RQ R... ..NP B...' },
      { levelName: '133 - Medium', gameString: '..R. RP.. BK.. ..B.' },
      { levelName: '134 - Medium', gameString: '..R. N..P ..P. NR..' },
      { levelName: '135 - Medium', gameString: '.N.. .BPB P.N. ....' },
      { levelName: '136 - Medium', gameString: '..N. .B.. PBN. P...' },
      { levelName: '137 - Medium', gameString: '.R.. ..P. ..B. NR.N' },
      { levelName: '138 - Medium', gameString: 'N.P. ..NP N..R .B..' },
      { levelName: '139 - Medium', gameString: '..QN P... ..P. ..BP' },
      { levelName: '140 - Medium', gameString: '...P ..N. R.KP N...' },
      { levelName: '141 - Medium', gameString: '.... R.PP B... .BK.' },
      { levelName: '142 - Medium', gameString: 'P... R.BN P... ..P.' },
      { levelName: '143 - Medium', gameString: '..N. Q.KP R... ...B' },
      { levelName: '144 - Medium', gameString: '..PP ..K. .R.. .NP.' },
      { levelName: '145 - Medium', gameString: '.... NNRP ...B ..P.' },
      { levelName: '146 - Medium', gameString: '.Q.. N..P ..P. R...' },
      { levelName: '147 - Medium', gameString: '...B ...R ..PN B...' },
      { levelName: '148 - Medium', gameString: '.... ...K ..QN N.B.' },
      { levelName: '149 - Medium', gameString: '..P. NQR. .... ...B' },
      { levelName: '150 - Medium', gameString: '..P. NP.. ..BR .R..' },
      { levelName: '151 - Medium', gameString: '.R.K .B.. .B.. N...' },
      { levelName: '152 - Medium', gameString: '.... .PNR ...B P.N.' },
      { levelName: '153 - Medium', gameString: 'P... .B.. ...N RN.P' },
      { levelName: '154 - Medium', gameString: 'P... R.B. .R.. ...N' },
      { levelName: '155 - Medium', gameString: '.P.N Q... ..R. ..K.' },
      { levelName: '156 - Medium', gameString: '.NP. .PN. P..B .P..' },
      { levelName: '157 - Medium', gameString: 'RP.. .PN. N... B..P' },
      { levelName: '158 - Medium', gameString: 'R... ..PP RP.N P...' },
      { levelName: '159 - Medium', gameString: '.P.. R..R P... NB.N' },
      { levelName: '160 - Medium', gameString: '..NP RP.. .N.. P.B.' },
      { levelName: '161 - Medium', gameString: 'P... ...R .NPR ..PN' },
      { levelName: '162 - Medium', gameString: '.RPP BBP. P... ....' },
      { levelName: '163 - Medium', gameString: '.N.. BP.. .N.P .K.B' },
      { levelName: '164 - Medium', gameString: '.NBK P... N.P. P...' },
      { levelName: '165 - Medium', gameString: '..PB NR.. ..P. ..NP' },
      { levelName: '166 - Medium', gameString: '.R.. ..N. P.PP ..BB' },
      { levelName: '167 - Medium', gameString: '...P .PB. N.R. .P.N' },
      { levelName: '168 - Medium', gameString: '..NN BP.. ..P. .BP.' },
      { levelName: '169 - Medium', gameString: '.P.K ...P P.N. .P.R' },
      { levelName: '170 - Medium', gameString: '.N.. .PB. ..P. PP.K' },
      { levelName: '171 - Medium', gameString: 'P.B. BP.. RN.K ....' },
      { levelName: '172 - Medium', gameString: '.PR. .B.N P... P.PB' },
      { levelName: '173 - Medium', gameString: '..P. ..BP PP.. ..BN' },
      { levelName: '174 - Medium', gameString: '.P.. .P.P ..N. PBR.' },
      { levelName: '175 - Medium', gameString: '.N.B ..P. P... KN.P' },
      { levelName: '176 - Medium', gameString: '..BP .N.N P..B ..P.' },
      { levelName: '177 - Medium', gameString: '.N.. PP.. B... .RPB' },
      { levelName: '178 - Medium', gameString: '.B.. .PB. .PN. P..N' },
      { levelName: '179 - Medium', gameString: 'PR.. .B.. ..NB .P.P' },
      { levelName: '180 - Medium', gameString: '.B.. .... N..B .NP.' },
      { levelName: '181 - Medium', gameString: '.N.. .P.. PBN. ..P.' },
      { levelName: '182 - Medium', gameString: 'PN.. ...N .PP. B...' },
      { levelName: '183 - Medium', gameString: 'NP.. B.P. ...B P.N.' },
      { levelName: '184 - Medium', gameString: '.... P.BN .PP. .P.B' },
      { levelName: '185 - Medium', gameString: 'P... PBP. PN.. .N..' },
      { levelName: '186 - Medium', gameString: 'P.PP ..B. .N.N ...B' },
      { levelName: '187 - Medium', gameString: 'B... P.N. .NBP .P..' },
      { levelName: '188 - Medium', gameString: 'P..N .BP. .RN. B...' },
      { levelName: '189 - Medium', gameString: '.P.P NKR. ..B. P...' },
      { levelName: '190 - Medium', gameString: '...P K..P NN.. B.P.' },
      { levelName: '191 - Medium', gameString: '.N.B .P.. ..N. PP.B' },
      { levelName: '192 - Medium', gameString: '.RN. ..B. P..R .B..' },
      { levelName: '193 - Medium', gameString: 'P..B .RN. R..B ....' },
      { levelName: '194 - Medium', gameString: '.... .PRP P.PP .P.B' },
      { levelName: '195 - Medium', gameString: '.RR. P..P .... .NN.' },
      { levelName: '196 - Medium', gameString: 'B.PN .K.. PP.B ....' },
      { levelName: '197 - Medium', gameString: '..N. .N.. P.PK P.P.' },
      { levelName: '198 - Medium', gameString: '...P NPRP ..B. NP..' },
      { levelName: '199 - Medium', gameString: 'B... ...P .RNN PP..' },
      { levelName: '200 - Medium', gameString: '.... .P.R P.PP .P.B' },
      { levelName: '201 - Hard', gameString: 'B.K. .N.. ..N. PP.B' },
      { levelName: '202 - Hard', gameString: '..P. ..RN ..NP B.B.' },
      { levelName: '203 - Hard', gameString: '...P RKQ. ..B. .RB.' },
      { levelName: '204 - Hard', gameString: 'B... P.P. RB.N N...' },
      { levelName: '205 - Hard', gameString: '...P ..B. PNBN ..K.' },
      { levelName: '206 - Hard', gameString: '.R.. ...B P... PNBN' },
      { levelName: '207 - Hard', gameString: 'B.R. ...R P.N. .NB.' },
      { levelName: '208 - Hard', gameString: 'N... .... P.P. BRBN' },
      { levelName: '209 - Hard', gameString: 'PB.R ...B NP.. N...' },
      { levelName: '210 - Hard', gameString: 'PBRN .... P... .NB.' },
      { levelName: '211 - Hard', gameString: '.PNP .RQ. R... ..B.' },
      { levelName: '212 - Hard', gameString: 'P... B... R.P. BN.N' },
      { levelName: '213 - Hard', gameString: '.B.. ...R PPQ. .NR.' },
      { levelName: '214 - Hard', gameString: '.P.P R.BB ...N N...' },
      { levelName: '215 - Hard', gameString: '.R.. ...P ..QN B.RN' },
      { levelName: '216 - Hard', gameString: '.P.P N.B. BK.. N...' },
      { levelName: '217 - Hard', gameString: 'NP.. QR.B .... B.P.' },
      { levelName: '218 - Hard', gameString: '...N .P.B BP.N ..R.' },
      { levelName: '219 - Hard', gameString: '..PB .RNN ...B R...' },
      { levelName: '220 - Hard', gameString: 'BN.K ..R. .B.P N...' },
      { levelName: '221 - Hard', gameString: '...B P.R. .BPN N...' },
      { levelName: '222 - Hard', gameString: '..P. B..R R.N. BP..' },
      { levelName: '223 - Hard', gameString: '.B.B ..R. .NPN R...' },
      { levelName: '224 - Hard', gameString: '.P.. .P.. K.B. BR.N' },
      { levelName: '225 - Hard', gameString: 'N.P. BRBN .... .P..' },
      { levelName: '226 - Hard', gameString: '.P.. .... BNRN B.P.' },
      { levelName: '227 - Hard', gameString: '..P. BRPN B... N...' },
      { levelName: '228 - Hard', gameString: '.NP. PQ.. ...R RB..' },
      { levelName: '229 - Hard', gameString: '..BR P..N Q..B .R..' },
      { levelName: '230 - Hard', gameString: 'Q.P. RN.N ...B B...' },
      { levelName: '231 - Hard', gameString: '..PN .N.. .PRB R...' },
      { levelName: '232 - Hard', gameString: '.R.. B.QB R... N.P.' },
      { levelName: '233 - Hard', gameString: '.N.B N..R P..Q ..R.' },
      { levelName: '234 - Hard', gameString: '.P.. N.RB BQ.. ..P.' },
      { levelName: '235 - Hard', gameString: 'B.NN .R.. P..B P...' },
      { levelName: '236 - Hard', gameString: '.B.. N.PB ..KR .R..' },
      { levelName: '237 - Hard', gameString: '...B ...R RNN. PP..' },
      { levelName: '238 - Hard', gameString: 'N... .N.. PRR. .BBP' },
      { levelName: '239 - Hard', gameString: '..NB .N.P PR.. B...' },
      { levelName: '240 - Hard', gameString: '..BN .RBP N... .P..' },
      { levelName: '241 - Hard', gameString: 'R... .P.B .NRB .BN.' },
      { levelName: '242 - Hard', gameString: 'N.PR ..N. ...B .BP.' },
      { levelName: '243 - Hard', gameString: '...R .RP. B..N .PB.' },
      { levelName: '244 - Hard', gameString: '...R RBP. K... NPB.' },
      { levelName: '245 - Hard', gameString: '..PB .PN. .... NR.B' },
      { levelName: '246 - Hard', gameString: '.NN. P.RP ...B B...' },
      { levelName: '247 - Hard', gameString: '..R. P..R NB.B .N.P' },
      { levelName: '248 - Hard', gameString: '.NBN .BPR ...P R...' },
      { levelName: '249 - Hard', gameString: 'R..R .PN. P..N BP..' },
      { levelName: '250 - Hard', gameString: '..P. .R.N ..PN PP..' },
      { levelName: '251 - Hard', gameString: 'P... .PRP ..K. RPB.' },
      { levelName: '252 - Hard', gameString: 'P..R .B.P .NN. P..P' },
      { levelName: '253 - Hard', gameString: 'B.P. ..N. BN.. ....' },
      { levelName: '254 - Hard', gameString: '.P.. P..R ..NK B.N.' },
      { levelName: '255 - Hard', gameString: '..B. P..P .PP. RNB.' },
      { levelName: '256 - Hard', gameString: '...N .P.K .B.. P.BP' },
      { levelName: '257 - Hard', gameString: '.P.. K... ..PB BN.P' },
      { levelName: '258 - Hard', gameString: '...P .BP. .NPR ..P.' },
      { levelName: '259 - Hard', gameString: '.P.. N..R B.P. NP.R' },
      { levelName: '260 - Hard', gameString: '..N. RP.. K... .NPB' },
      { levelName: '261 - Hard', gameString: 'B..P KN.. ..N. B.P.' },
      { levelName: '262 - Hard', gameString: 'P..B ..PR .P.. PB..' },
      { levelName: '263 - Hard', gameString: '.NP. K... .PPP .B..' },
      { levelName: '264 - Hard', gameString: '.PNP .... B..Q ..P.' },
      { levelName: '265 - Hard', gameString: '..B. N..B PPP. .P..' },
      { levelName: '266 - Hard', gameString: '.... .P.B .PPP .NN.' },
      { levelName: '267 - Hard', gameString: '.K.. B.PN .... B.PN' },
      { levelName: '268 - Hard', gameString: '.N.. PB.N B... ....' },
      { levelName: '269 - Hard', gameString: '.BP. PP.. NP.P P.PB' },
      { levelName: '270 - Hard', gameString: '.PK. .B.R ...P .PN.' },
      { levelName: '271 - Hard', gameString: '.P.. R.NP .N.. B..K' },
      { levelName: '272 - Hard', gameString: 'KN.N ..P. P.B. ..P.' },
      { levelName: '273 - Hard', gameString: '..B. .P.N .B.. NPP.' },
      { levelName: '274 - Hard', gameString: '.N.. .BPP ..PP N...' },
      { levelName: '275 - Hard', gameString: '..PB PP.. .R.. .P.N' },
      { levelName: '276 - Hard', gameString: '.R.. .R.. N..P N.B.' },
      { levelName: '277 - Hard', gameString: 'B..N NP.B B.PN N..B' },
      { levelName: '278 - Hard', gameString: '...P BQ.. .BR. .P..' },
      { levelName: '279 - Hard', gameString: '.PN. P... RB.. ..PB' },
      { levelName: '280 - Hard', gameString: 'PRP. .... .B.P P.N.' },
      { levelName: '281 - Hard', gameString: 'P... ...K .P.R .BNQ' },
      { levelName: '282 - Hard', gameString: '.PB. K... .N.N P..P' },
      { levelName: '301 - Expert', gameString: '.P.. .B.. ..NP BRKN' },
      { levelName: '302 - Expert', gameString: '.N.P P... BRB. N.R.' },
      { levelName: '303 - Expert', gameString: '.N.P K.B. B.N. R.P.' },
      { levelName: '304 - Expert', gameString: '.NBN ..PB ..R. P.R.' },
      { levelName: '305 - Expert', gameString: '.PKP ..BB ..NN R...' },
      { levelName: '306 - Expert', gameString: 'PB.. .N.P RBR. .N..' },
      { levelName: '307 - Expert', gameString: 'KN.N ..B. BR.. .PP.' },
      { levelName: '308 - Expert', gameString: 'RP.. N..P BB.N ..R.' },
      { levelName: '309 - Expert', gameString: 'QP.N N.RB B... ..P.' },
      { levelName: '310 - Expert', gameString: 'B.P. B.RN P..N .R..' },
      { levelName: '311 - Expert', gameString: '.R.. R..P B.BN P.N.' },
      { levelName: '312 - Expert', gameString: 'NP.. R... B.P. B.RN' },
      { levelName: '313 - Expert', gameString: 'NNP. QR.. ...R BB..' },
      { levelName: '314 - Expert', gameString: '..P. NBN. ...R PBR.' },
      { levelName: '315 - Expert', gameString: '.R.. N.N. B..P P.RB' },
      { levelName: '316 - Expert', gameString: '.R.. N.R. B.BN P.P.' },
      { levelName: '317 - Expert', gameString: 'B.N. B.PN P.R. .R..' },
      { levelName: '318 - Expert', gameString: '..P. BRNN ..RB P...' },
      { levelName: '319 - Expert', gameString: 'NBP. QR.. ...R BP..' },
      { levelName: '320 - Expert', gameString: '.P.. RBN. ...R PBN.' },
      { levelName: '321 - Expert', gameString: '...P P.N. .KBR B.N.' },
      { levelName: '322 - Expert', gameString: '.P.R ...B RP.N N.B.' },
      { levelName: '323 - Expert', gameString: 'NBP. RQ.. ...R BP..' },
      { levelName: '324 - Expert', gameString: 'P.P. RR.. ...B BN.N' },
      { levelName: '325 - Expert', gameString: '..PR P..R NB.B N...' },
      { levelName: '326 - Expert', gameString: '.RPP .BNB ...N R...' },
      { levelName: '327 - Expert', gameString: '...P BP.. NNR. BR..' },
      { levelName: '328 - Expert', gameString: '.K.P .PRB .N.B R...' },
      { levelName: '329 - Expert', gameString: '.PBN N.R. ..BR P...' },
      { levelName: '330 - Expert', gameString: '...P PBR. .N.. BRN.' },
      { levelName: '331 - Expert', gameString: '..BP .N.K .PRB R...' },
      { levelName: '332 - Expert', gameString: 'R.PP .B.. N.R. .NB.' },
      { levelName: '333 - Expert', gameString: 'N.RB R..B P... .NP.' },
      { levelName: '334 - Expert', gameString: 'B.R. .B.N N.RP P...' },
      { levelName: '335 - Expert', gameString: '...R .R.. PNP. BNB.' },
      { levelName: '336 - Expert', gameString: '..R. RN.P P..B BN..' },
      { levelName: '337 - Expert', gameString: '..PR .NN. ..P. BB.P' },
      { levelName: '338 - Expert', gameString: '.NN. .RR. P..B P..B' },
      { levelName: '339 - Expert', gameString: '...R B.P. BRN. .NP.' },
      { levelName: '340 - Expert', gameString: '..P. .RR. NN.. BP.B' },
      { levelName: '341 - Expert', gameString: '..NB .BPN .RP. R...' },
      { levelName: '342 - Expert', gameString: '.BNN .BPP .R.. R...' },
      { levelName: '343 - Expert', gameString: '.RP. BR.P NB.. N...' },
      { levelName: '344 - Expert', gameString: '.PN. .PN. B..B R..R' },
      { levelName: '345 - Expert', gameString: '.NB. ..BP RR.P N...' },
      { levelName: '346 - Expert', gameString: '.P.. .B.. P.NP P.N.' },
      { levelName: '347 - Expert', gameString: '.R.P ..P. BBN. .N..' },
      { levelName: '1001 - New-Set', gameString: '..P. P.N. N... .Q.R' },
      { levelName: '1002 - New-Set', gameString: '.PK. .B.. ...P .PN.' },
      { levelName: '1003 - New-Set', gameString: 'BB.. ..NN .P.. ..P.' },
      { levelName: '1004 - New-Set', gameString: '.N.. B.NB .P.. .P..' },
      { levelName: '1005 - New-Set', gameString: 'BNPP .N.. ..B. ....' },
      { levelName: '1006 - New-Set', gameString: 'P.B. .NB. .P.P ....' },
      { levelName: '1007 - New-Set', gameString: 'BP.. ..B. P.N. ..N.' },
      { levelName: '1008 - New-Set', gameString: '.NK. B... ..N. .B.P' },
      { levelName: '1009 - New-Set', gameString: '..NN B... ..PP ..B.' },
      { levelName: '1010 - New-Set', gameString: '.P.. ..NB PP.. ..B.' },
      { levelName: '1011 - New-Set', gameString: 'PN.. .... P.P. ..NB' },
      { levelName: '1012 - New-Set', gameString: '.... PP.. ..PB .NN.' },
      { levelName: '1013 - New-Set', gameString: 'P.P. ..B. NN.. P...' },
      { levelName: '1014 - New-Set', gameString: '.R.. P.N. P..P .BP.' },
      { levelName: '1015 - New-Set', gameString: '..N. BN.. P..K PP..' },
      { levelName: '1016 - New-Set', gameString: '.N.P PBP. ..R. .B..' },
      { levelName: '1017 - New-Set', gameString: '...N P.B. P.P. .R.B' },
      { levelName: '1018 - New-Set', gameString: '.BK. N... ..N. .B.P' },
      { levelName: '1019 - New-Set', gameString: '...B .N.. .BN. ...P' }
    ];
  }
}
