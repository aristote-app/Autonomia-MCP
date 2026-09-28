"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExecutionMap({ map }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!map?.steps?.length) return null;

  const activeStep = map.steps[activeIndex];

  return (
    <section className="executionMap" aria-labelledby="execution-map-title">
      <div className="executionMapGlow executionMapGlowA" aria-hidden="true" />
      <div className="executionMapGlow executionMapGlowB" aria-hidden="true" />

      <div className="executionMapInner">
        <header className="executionMapHeader">
          <div>
            <p className="executionMapEyebrow">AUTONOMIA / EXECUTION MAP</p>
            <h2 id="execution-map-title">Du problème métier au système IA opérationnel.</h2>
          </div>
          <p className="executionMapIntro">
            Comprenez le chemin en un coup d’œil. Cliquez sur une étape pour voir ce qui est réellement implémenté, puis ouvrez l’explication détaillée si vous voulez aller plus loin.
          </p>
        </header>

        <div className="executionSnapshot" aria-label="Le projet en un coup d’œil">
          <div>
            <span>CHARGE INDICATIVE</span>
            <strong>{map.effort}</strong>
            <small>MVP · estimation selon périmètre</small>
          </div>
          <div>
            <span>COMPLEXITÉ</span>
            <strong>{map.complexity}</strong>
            <small>Technique + métier</small>
          </div>
          <div>
            <span>EXPERTISES</span>
            <strong>{map.expertsLabel}</strong>
            <small>Mobilisées selon le besoin</small>
          </div>
          <div>
            <span>STACK FONCTIONNEL</span>
            <strong>{map.stack}</strong>
            <small>À confirmer dans l’environnement réel</small>
          </div>
          <div>
            <span>AUTOMATISATION</span>
            <strong>{map.automation}</strong>
            <small>Avec garde-fous</small>
          </div>
        </div>

        <div className="executionFlow" aria-label="Transformation du point A au point B">
          <a className="executionEndpoint executionEndpointPain" href="#cadrage">
            <span>POINT A / PAIN</span>
            <strong>{map.before.title}</strong>
            <p>{map.before.text}</p>
            <b>01</b>
          </a>

          <div className="executionFlowCenter">
            <div className="executionFlowSteps">
              {map.steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  className={index === activeIndex ? "executionStep active" : "executionStep"}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={index === activeIndex}
                  aria-controls="execution-step-detail"
                >
                  <span className="executionStepNumber">{String(index + 1).padStart(2, "0")}</span>
                  <span className="executionStepDot" aria-hidden="true" />
                  <small>{step.kicker}</small>
                  <strong>{step.title}</strong>
                </button>
              ))}
            </div>

            <div className="executionStepDetail" id="execution-step-detail" aria-live="polite">
              <div className="executionStepDetailTop">
                <span>{activeStep.kicker}</span>
                <b>{String(activeIndex + 1).padStart(2, "0")} / {String(map.steps.length).padStart(2, "0")}</b>
              </div>
              <div className="executionStepDetailGrid">
                <div>
                  <h3>{activeStep.title}</h3>
                  <p>{activeStep.detail}</p>
                </div>
                <div className="executionStepDetailSide">
                  <span>CE QUI EST IMPLÉMENTÉ</span>
                  <p>{activeStep.implementation}</p>
                  <a href={`#${activeStep.anchor}`}>
                    Voir l’explication détaillée <span aria-hidden="true">↘</span>
                  </a>
                </div>
              </div>
            </div>

            <a className="executionSafetyGate" href="#exceptions">
              <span>SAFETY GATE</span>
              <strong>Exceptions, sécurité et reprise humaine</strong>
              <p>{map.safety}</p>
              <b>Voir les garde-fous →</b>
            </a>
          </div>

          <a className="executionEndpoint executionEndpointResult" href="#mesure">
            <span>POINT B / OUTCOME</span>
            <strong>{map.after.title}</strong>
            <p>{map.after.text}</p>
            <b>06</b>
          </a>
        </div>

        <div className="executionRealityGrid">
          <article className="executionRealityCard executionRealityAi">
            <span>CE QUE L’IA PREND EN CHARGE</span>
            <strong>Interpréter sans masquer l’incertitude.</strong>
            <p>{map.aiDoes}</p>
            <a href="#regles-ia">Voir les règles IA →</a>
          </article>

          <article className="executionRealityCard">
            <span>CE QUE L’HUMAIN GARDE</span>
            <strong>Le contrôle là où il compte.</strong>
            <p>{map.humanKeeps}</p>
            <a href="#humain">Voir le contrôle humain →</a>
          </article>

          <article className="executionRealityCard">
            <span>MVP → VERSION CIBLE</span>
            <strong>Commencer utile. Étendre ensuite.</strong>
            <p><b>MVP :</b> {map.mvp}</p>
            <p><b>Cible :</b> {map.target}</p>
            <a href="#mvp">Voir la trajectoire →</a>
          </article>
        </div>

        <div className="executionExperts">
          <div className="executionExpertsHeader">
            <div>
              <p className="executionMapEyebrow">ÉQUIPE TYPE</p>
              <h3>Les expertises qui transforment le schéma en système réel.</h3>
            </div>
            <p>Le bon projet ne consiste pas à “mettre de l’IA”. Il consiste à mobiliser les bons rôles sur les bonnes briques.</p>
          </div>

          <div className="executionExpertGrid">
            {map.experts.map((expert, index) => (
              <Link key={expert.title} className="executionExpertCard" href={expert.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{expert.title}</strong>
                <p>{expert.text}</p>
                <b>Voir cette expertise →</b>
              </Link>
            ))}
          </div>
        </div>

        <div className="executionBottomGrid">
          <article>
            <span>POUR DÉMARRER</span>
            <h3>Ce que le client doit mettre sur la table.</h3>
            <ul>
              {map.requirements.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article>
            <span>MESURE</span>
            <h3>Comment savoir si le système fonctionne.</h3>
            <p>{map.metrics}</p>
            <a href="#mesure">Voir les indicateurs et la méthode →</a>
          </article>
        </div>

        <p className="executionEstimateNote">
          * Charge indicative de réalisation d’un MVP. Elle dépend des accès, des systèmes existants, du niveau de sécurité, des règles métier, des tests et du périmètre réellement retenu.
        </p>
      </div>
    </section>
  );
}
