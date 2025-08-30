import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4002';

// Fonction utilitaire pour les tests
async function testEndpoint(method, endpoint, data = null, description = '') {
  try {
    console.log(`\n🧪 Test: ${description || `${method} ${endpoint}`}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Réponse:`, JSON.stringify(result, null, 2));
    
    return { success: true, data: result };
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Tests des endpoints
async function runTests() {
  console.log('🚀 Démarrage des tests de l\'API TagZai...\n');
  
  // Test 1: Health check
  await testEndpoint('GET', '/health', null, 'Vérification de l\'état du service');
  
  // Test 2: Extraction de tags
  await testEndpoint('POST', '/extract', {
    text: "Le vent souffle sur la mer, les vagues dansent au rythme du temps",
    title: "Poème marin",
    top: 5
  }, 'Extraction de tags depuis un texte');
  
  // Test 3: Ingestion d'un poème
  await testEndpoint('POST', '/ingest', {
    poem_id: 'test_poem_001',
    text: "L'amour est une rose qui fleurit dans le jardin de l'âme",
    title: "Rose d'amour"
  }, 'Ingestion d\'un poème avec extraction automatique');
  
  // Test 4: Suggestions de tags
  await testEndpoint('POST', '/suggest', {
    seed: ['amour', 'rose'],
    limit: 3
  }, 'Suggestions de tags basées sur des tags existants');
  
  // Test 5: Tags liés
  await testEndpoint('GET', '/related/amour?limit=3', null, 'Tags liés au tag "amour"');
  
  // Test 6: Tags tendance
  await testEndpoint('GET', '/trending?limit=5&days=1', null, 'Tags tendance du dernier jour');
  
  // Test 7: Statistiques générales
  await testEndpoint('GET', '/stats', null, 'Statistiques générales de l\'API');
  
  // Test 8: Statistiques d'un tag spécifique
  await testEndpoint('GET', '/stats/amour', null, 'Statistiques du tag "amour"');
  
  console.log('\n🎯 Tests terminés!');
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

// Exécution des tests
runTests().catch(console.error);