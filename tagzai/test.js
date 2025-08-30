import { extractTags } from './extract.js';

// Test simple de l'extraction de tags
console.log('🧪 Test de l\'extraction de tags...\n');

const testTexts = [
  {
    text: "Le vent souffle sur la mer, les vagues dansent au rythme du temps",
    title: "Poème marin",
    description: "Texte avec titre et mots thématiques"
  },
  {
    text: "L'amour est une rose qui fleurit dans le jardin de l'âme",
    title: "",
    description: "Texte romantique sans titre"
  },
  {
    text: "La technologie avance rapidement, l'intelligence artificielle transforme notre monde",
    title: "Futur numérique",
    description: "Texte technique avec bigrammes potentiels"
  }
];

testTexts.forEach((test, index) => {
  console.log(`📝 Test ${index + 1}: ${test.description}`);
  console.log(`Texte: "${test.text}"`);
  if (test.title) console.log(`Titre: "${test.title}"`);
  
  try {
    const result = extractTags({
      text: test.text,
      title: test.title,
      top: 8
    });
    
    console.log('✅ Résultat:');
    console.log(`   Tags extraits: ${result.total}`);
    console.log(`   Tokens traités: ${result.processed}`);
    console.log('   Top tags:');
    result.tags.slice(0, 5).forEach((tag, i) => {
      console.log(`     ${i + 1}. ${tag.name} (score: ${tag.score})`);
    });
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  console.log(''); // Ligne vide pour la lisibilité
});

console.log('🎯 Test terminé!');