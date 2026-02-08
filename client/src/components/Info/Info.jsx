import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styles from "./Info.module.scss";

const Info = () => {
    const { user } = useSelector((state) => state.users);
    const { t } = useTranslation();
    return (
      <article className={styles.wrapper}>
        <h1>{t("header.info")}</h1>
        <h2>{t("info_panel.navigation")}</h2>
        <nav>
          <div>
            {user && <h3>{t("custom_panel.standart_pieces")}</h3>}
            <ul>
              <li>
                <a href="#section1">{t("pieces.pawn.name")}</a>
              </li>
              <li>
                <a href="#section2">{t("pieces.horse.name")}</a>
              </li>
              <li>
                <a href="#section3">{t("pieces.bishop.name")}</a>
              </li>
              <li>
                <a href="#section4">{t("pieces.rook.name")}</a>
              </li>
              <li>
                <a href="#section5">{t("pieces.ferz.name")}</a>
              </li>
              <li>
                <a href="#section6">{t("pieces.king.name")}</a>
              </li>
            </ul>
          </div>
          {user && (
            <div>
              <h3>{t("custom_panel.old_pieces")}</h3>
              <ul>
                <li>
                  <a href="#section7">{t("pieces.tank.name")}</a>
                </li>
                <li>
                  <a href="#section8">{t("pieces.camel.name")}</a>
                </li>
                <li>
                  <a href="#section9">{t("pieces.giraffe.name")}</a>
                </li>
                <li>
                  <a href="#section10">{t("pieces.rukh.name")}</a>
                </li>
              </ul>
            </div>
          )}
          {user && (
            <div>
              <h3>{t("custom_panel.special_pieces")}</h3>
              <ul>
                <li>
                  <a href="#section11">{t("pieces.dinozavr.name")}</a>
                </li>
                <li>
                  <a href="#section12">{t("pieces.checkers.name")}</a>
                </li>
              </ul>
            </div>
          )}
        </nav>
        <div id="section1">
          <div>
            <h2>{t("pieces.pawn.name")}</h2>
            <div>
              <img src="/src/assets/icons/white_soldier.png" alt="white_pawn" />
              <img src="/src/assets/icons/black_soldier.png" alt="black_pawn" />
            </div>
          </div>
          <h3>{t("pieces.desc_caption")}</h3>
          <p>{t("pieces.pawn.desc")}</p>
          <div className={styles["pieces-info"]}>
            <img
              src="/src/assets/images/pawn_directions.png"
              alt="pawn_directions"
            />
            <img src="/src/assets/images/pawn_attacks.png" alt="pawn_attacks" />
          </div>
          <h3>{t("pieces.history_caption")}</h3>
          <p>{t("pieces.pawn.history")}</p>
        </div>
        <div id="section2">
          <div>
            <h2>{t("pieces.horse.name")}</h2>
            <div>
              <img src="/src/assets/icons/white_horse.png" alt="white_horse" />
              <img src="/src/assets/icons/black_horse.png" alt="black_horse" />
            </div>
          </div>
          <h3>{t("pieces.desc_caption")}</h3>
          <p>{t("pieces.horse.desc")}</p>
          <div className={styles["pieces-info"]}>
            <img
              src="/src/assets/images/horse_directions.png"
              alt="horse_directions"
            />
            <img
              src="/src/assets/images/horse_attacks.png"
              alt="horse_attacks"
            />
          </div>
          <h3>{t("pieces.history_caption")}</h3>
          <p>{t("pieces.horse.history")}</p>
        </div>
        <div id="section3">
          <div>
            <h2>{t("pieces.bishop.name")}</h2>
            <div>
              <img
                src="/src/assets/icons/white_bishop.png"
                alt="white_bishop"
              />
              <img
                src="/src/assets/icons/black_bishop.png"
                alt="black_bishop"
              />
              <img
                src="/src/assets/icons/white_elephant.png"
                alt="white_elephant"
              />
              <img
                src="/src/assets/icons/black_elephant.png"
                alt="black_elephant"
              />
            </div>
          </div>
          <h3>{t("pieces.desc_caption")}</h3>
          <p>{t("pieces.bishop.desc")}</p>
          <div className={styles["pieces-info"]}>
            <img
              src="/src/assets/images/bishop_directions.png"
              alt="bishop_directions"
            />
            <img
              src="/src/assets/images/bishop_attacks.png"
              alt="bishop_attacks"
            />
          </div>
          <h3>{t("pieces.history_caption")}</h3>
          <p>{t("pieces.bishop.history")}</p>
          <div className={styles["pieces-info"]}>
            <img
              src="/src/assets/images/elephant_directions.png"
              alt="elephant_directions"
            />
            <img
              src="/src/assets/images/elephant_attacks.png"
              alt="elephant_attacks"
            />
          </div>
        </div>
        <div id="section4">
          <div>
            <h2>{t("pieces.rook.name")}</h2>
            <div>
              <img src="/src/assets/icons/white_rook.png" alt="white_rook" />
              <img src="/src/assets/icons/black_rook.png" alt="black_rook" />
              <img
                src="/src/assets/icons/white_sailboat.png"
                alt="white_sailboat"
              />
              <img
                src="/src/assets/icons/black_sailboat.png"
                alt="black_sailboat"
              />
              <img
                src="/src/assets/icons/white_chariot.png"
                alt="white_chariot"
              />
              <img
                src="/src/assets/icons/black_chariot.png"
                alt="black_chariot"
              />
            </div>
          </div>
          <h3>{t("pieces.desc_caption")}</h3>
          <p>{t("pieces.rook.desc")}</p>
          <div className={styles["pieces-info"]}>
            <img
              src="/src/assets/images/rook_directions.png"
              alt="rook_directions"
            />
            <img src="/src/assets/images/rook_attacks.png" alt="rook_attacks" />
          </div>
          <h3>{t("pieces.history_caption")}</h3>
          <p>{t("pieces.rook.history")}</p>
        </div>
        <div id="section5">
          <div>
            <h2>{t("pieces.ferz.name")}</h2>
            <div>
              <img src="/src/assets/icons/white_ferz.png" alt="white_ferz" />
              <img src="/src/assets/icons/black_ferz.png" alt="black_ferz" />
              <img
                src="/src/assets/icons/white_firzan.png"
                alt="white_firzan"
              />
              <img
                src="/src/assets/icons/black_firzan.png"
                alt="black_firzan"
              />
            </div>
          </div>
          <h3>{t("pieces.desc_caption")}</h3>
          <p>{t("pieces.ferz.desc")}</p>
          <div className={styles["pieces-info"]}>
            <img
              src="/src/assets/images/ferz_directions.png"
              alt="ferz_directions"
            />
            <img src="/src/assets/images/ferz_attacks.png" alt="ferz_attacks" />
          </div>
          <h3>{t("pieces.history_caption")}</h3>
          <p>{t("pieces.ferz.history")}</p>
          <div className={styles["pieces-info"]}>
            <img
              src="/src/assets/images/firzan_directions.png"
              alt="firzan_directions"
            />
            <img
              src="/src/assets/images/firzan_attacks.png"
              alt="firzan_attacks"
            />
          </div>
        </div>
        <div id="section6">
          <div>
            <h2>{t("pieces.king.name")}</h2>
            <div>
              <img src="/src/assets/icons/white_king.png" alt="white_king" />
              <img src="/src/assets/icons/black_king.png" alt="black_king" />
            </div>
          </div>
          <h3>{t("pieces.desc_caption")}</h3>
          <p>{t("pieces.king.desc")}</p>
          <div className={styles["pieces-info"]}>
            <img
              src="/src/assets/images/king_directions.png"
              alt="king_directions"
            />
            <img src="/src/assets/images/king_attacks.png" alt="king_attacks" />
            <img
              src="/src/assets/images/king_castling.png"
              alt="king_castling"
            />
            <img
              src="/src/assets/images/king_castling_second.png"
              alt="king_castling_second"
            />
            <img
              src="/src/assets/images/king_castling_third.png"
              alt="king_castling_third"
            />
          </div>
          <h3>{t("pieces.history_caption")}</h3>
          <p>{t("pieces.king.history")}</p>
        </div>
        {user && (
          <div>
            <div id="section7" className={styles["info-section"]}>
              <h2>{t("pieces.tank.name")}</h2>
              <div>
                <img src="/src/assets/icons/white_tank.png" alt="white_tank" />
                <img src="/src/assets/icons/black_tank.png" alt="black_tank" />
              </div>
              <h3>{t("pieces.desc_caption")}</h3>
              <p>{t("pieces.tank.desc")}</p>
              <div className={styles["pieces-info"]}>
                <img
                  src="/src/assets/images/tank_directions.png"
                  alt="tank_directions"
                />
                <img
                  src="/src/assets/images/tank_attacks.png"
                  alt="tank_attacks"
                />
              </div>
              <h3>{t("pieces.history_caption")}</h3>
              <p>{t("pieces.tank.history")}</p>
            </div>
            <div id="section8">
              <h2>{t("pieces.camel.name")}</h2>
              <div>
                <img
                  src="/src/assets/icons/white_camel.png"
                  alt="white_camel"
                />
                <img
                  src="/src/assets/icons/black_camel.png"
                  alt="black_camel"
                />
              </div>
              <h3>{t("pieces.desc_caption")}</h3>
              <p>{t("pieces.camel.desc")}</p>
              <div className={styles["pieces-info"]}>
                <img
                  src="/src/assets/images/camel_directions.png"
                  alt="camel_directions"
                />
                <img
                  src="/src/assets/images/camel_attacks.png"
                  alt="camel_attacks"
                />
              </div>
              <h3>{t("pieces.history_caption")}</h3>
              <p>{t("pieces.camel.history")}</p>
            </div>
            <div id="section9">
              <h2>{t("pieces.giraffe.name")}</h2>
              <div>
                <img
                  src="/src/assets/icons/white_giraffe.png"
                  alt="white_giraffe"
                />
                <img
                  src="/src/assets/icons/black_giraffe.png"
                  alt="white_giraffe"
                />
              </div>
              <h3>{t("pieces.desc_caption")}</h3>
              <p>{t("pieces.giraffe.desc")}</p>
              <div className={styles["pieces-info"]}>
                <img
                  src="/src/assets/images/giraffe_directions_1.png"
                  alt="giraffe_directions_1"
                />
                <img
                  src="/src/assets/images/giraffe_directions_2.png"
                  alt="giraffe_directions_2"
                />
                <img
                  src="/src/assets/images/giraffe_attacks.png"
                  alt="giraffe_attacks"
                />
              </div>
              <h3>{t("pieces.history_caption")}</h3>
              <p>{t("pieces.giraffe.history")}</p>
            </div>
            <div id="section10">
              <h2>{t("pieces.rukh.name")}</h2>
              <div>
                <img src="/src/assets/icons/white_rukh.png" alt="white_rukh" />
                <img src="/src/assets/icons/black_rukh.png" alt="black_rukh" />
              </div>
              <h3>{t("pieces.desc_caption")}</h3>
              <p>{t("pieces.rukh.desc")}</p>
              <div className={styles["pieces-info"]}>
                <img
                  src="/src/assets/images/rukh_directions.png"
                  alt="rukh_directions"
                />
                <img
                  src="/src/assets/images/rukh_attacks.png"
                  alt="rukh_attacks"
                />
              </div>
              <h3>{t("pieces.history_caption")}</h3>
              <p>{t("pieces.rukh.history")}</p>
            </div>
            <div id="section11">
              <h2>{t("pieces.dinozavr.name")}</h2>
              <div>
                <img
                  src="/src/assets/icons/white_dinozavr.png"
                  alt="white_dinozavr"
                />
                <img
                  src="/src/assets/icons/black_dinozavr.png"
                  alt="black_dinozavr"
                />
              </div>
              <h3>{t("pieces.desc_caption")}</h3>
              <p>{t("pieces.dinozavr.desc")}</p>
              <div className={styles["pieces-info"]}>
                <img
                  src="/src/assets/images/dinozavr_directions.png"
                  alt="dinozavr_directions"
                />
                <img
                  src="/src/assets/images/dinozavr_attacks.png"
                  alt="dinozavr_attacks"
                />
                <img
                  src="/src/assets/images/dinozavr_block.png"
                  alt="dinozavr_block"
                />
              </div>
              <h3>{t("pieces.history_caption")}</h3>
              <p>{t("pieces.dinozavr.history")}</p>
            </div>
            <div id="section12">
              <h2>{t("pieces.checkers.name")}</h2>
              <div>
                <img
                  src="/src/assets/icons/white_checkers.png"
                  alt="white_checkers"
                />
                <img
                  src="/src/assets/icons/black_checkers.png"
                  alt="black_checkers"
                />
              </div>
              <h3>{t("pieces.desc_caption")}</h3>
              <p>{t("pieces.checkers.desc")}</p>
              <div className={styles["pieces-info"]}>
                <img
                  src="/src/assets/images/checkers_directions.png"
                  alt="checkers_directions"
                />
                <img
                  src="/src/assets/images/checkers_attacks.png"
                  alt="checkers_attacks"
                />
              </div>
              <h3>{t("pieces.history_caption")}</h3>
              <p>{t("pieces.checkers.history")}</p>
            </div>
          </div>
        )}
      </article>
    );
};

export default Info;
