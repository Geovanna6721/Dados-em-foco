import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Grafico() {
  const { titulo, linkPerguntas, linkRespostas } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráficos do Formulário</Text>

      <Text style={styles.label}>Título:</Text>
      <Text style={styles.value}>{titulo}</Text>

      <Text style={styles.label}>Link de Perguntas:</Text>
      <Text style={styles.value}>{linkPerguntas}</Text>

      <Text style={styles.label}>Link de Respostas:</Text>
      <Text style={styles.value}>{linkRespostas}</Text>

      {/* Aqui você pode carregar os gráficos usando o link de respostas */}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  label: { fontWeight: '600', marginTop: 12 },
  value: { color: '#3b82f6' },
  backButton: {
    marginTop: 32,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
