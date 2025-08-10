export interface Question {
  id: string;
  text: string;
  placeholder: string;
  type: 'text' | 'voice' | 'mixed';
  modeSpecific?: {
    [modeId: string]: {
      text?: string;
      placeholder?: string;
      examples?: string[];
    };
  };
}

export const baseQuestions: Question[] = [
  {
    id: 'emotion-spontanee',
    text: 'Quelle émotion traverse votre esprit en ce moment précis ?',
    placeholder: 'Décrivez cette émotion sans réfléchir...',
    type: 'mixed',
    modeSpecific: {
      'sprint-creatif': {
        text: 'FLASH ! Première émotion qui vous traverse ?',
        placeholder: 'Un mot, une image, une sensation...'
      },
      'synesthesie': {
        text: 'Cette émotion : quelle couleur, quel son, quelle texture ?',
        placeholder: 'Mélangez vos sens librement...',
        examples: ['Rouge qui crépite', 'Bleu qui murmure', 'Jaune rugueux et chaud']
      },
      'flux-vocal': {
        text: 'Parlez-nous de ce que vous ressentez maintenant...',
        placeholder: 'Laissez votre voix porter cette émotion...'
      }
    }
  },
  {
    id: 'souvenir-vivace',
    text: 'Quel souvenir remonte à la surface quand vous fermez les yeux ?',
    placeholder: 'Racontez ce souvenir comme s\'il se déroulait maintenant...',
    type: 'mixed',
    modeSpecific: {
      'sprint-creatif': {
        text: 'SOUVENIR EXPRESS ! Le premier qui surgit ?',
        placeholder: 'Une scène, un visage, un instant...'
      },
      'exploration-profonde': {
        text: 'Plongez dans un souvenir qui vous définit. Que révèle-t-il de vous ?',
        placeholder: 'Explorez les détails, les sensations, les enseignements...'
      },
      'constellation': {
        text: 'Quel souvenir pourrait résonner avec les expériences d\'autres participants ?',
        placeholder: 'Pensez aux expériences universelles qui nous lient...'
      }
    }
  },
  {
    id: 'vision-creative',
    text: 'Si vous pouviez matérialiser une idée pure, que créeriez-vous ?',
    placeholder: 'Imaginez sans limites, décrivez votre création...',
    type: 'mixed',
    modeSpecific: {
      'synesthesie': {
        text: 'Cette création : quels sens solliciterait-elle ? Comment la percevrait-on ?',
        placeholder: 'Décrivez l\'expérience sensorielle complète...'
      },
      'flux-vocal': {
        text: 'Décrivez à voix haute cette création qui n\'existe que dans votre esprit...',
        placeholder: 'Laissez les mots construire cette vision...'
      }
    }
  },
  {
    id: 'essence-actuelle',
    text: 'Un mot qui capture l\'essence de votre état d\'esprit créatif actuel ?',
    placeholder: 'Le premier mot qui résonne en vous...',
    type: 'mixed',
    modeSpecific: {
      'sprint-creatif': {
        text: 'DERNIER SPRINT ! Votre mot essence ?',
        placeholder: 'Un seul mot, le plus juste...'
      },
      'constellation': {
        text: 'Quel mot pourrait créer un pont avec les autres créations ?',
        placeholder: 'Un mot qui relie, qui fait écho...'
      }
    }
  }
];

export const getQuestionsForMode = (modeId: string): Question[] => {
  return baseQuestions.map(question => {
    const modeSpecific = question.modeSpecific?.[modeId];
    return {
      ...question,
      text: modeSpecific?.text || question.text,
      placeholder: modeSpecific?.placeholder || question.placeholder
    };
  });
};

// Questions spécifiques pour l'exploration profonde (7 jours)
export const deepExplorationQuestions: Question[] = [
  {
    id: 'day-1-foundation',
    text: 'Jour 1 : Quel souvenir d\'enfance continue de vous influencer aujourd\'hui ?',
    placeholder: 'Explorez ce souvenir et son impact sur qui vous êtes...',
    type: 'mixed'
  },
  {
    id: 'day-2-evolution',
    text: 'Jour 2 : Comment ce souvenir d\'hier influence-t-il vos choix créatifs ?',
    placeholder: 'Tracez les liens entre passé et présent...',
    type: 'mixed'
  },
  {
    id: 'day-3-contrast',
    text: 'Jour 3 : Quelle part de vous cherche l\'opposé de ce souvenir fondateur ?',
    placeholder: 'Explorez la tension créatrice en vous...',
    type: 'mixed'
  },
  {
    id: 'day-4-projection',
    text: 'Jour 4 : Dans 10 ans, comment ce voyage créatif aura-t-il transformé cette influence ?',
    placeholder: 'Imaginez votre évolution future...',
    type: 'mixed'
  },
  {
    id: 'day-5-community',
    text: 'Jour 5 : Comment votre expérience unique peut-elle nourrir celle des autres ?',
    placeholder: 'Pensez à votre contribution au collectif...',
    type: 'mixed'
  },
  {
    id: 'day-6-synthesis',
    text: 'Jour 6 : Quel pattern émerge de ces 5 jours d\'exploration ?',
    placeholder: 'Observez les récurrences, les thèmes qui se dessinent...',
    type: 'mixed'
  },
  {
    id: 'day-7-manifestation',
    text: 'Jour 7 : Quelle création concrète pourrait incarner cette semaine d\'introspection ?',
    placeholder: 'Imaginez comment matérialiser cette découverte de soi...',
    type: 'mixed'
  }
];