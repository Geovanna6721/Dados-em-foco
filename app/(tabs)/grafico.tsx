import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export default function Grafico() {
  const { titulo, formId: rawFormId } = useLocalSearchParams();
  const router = useRouter();

  const formId = rawFormId?.trim();
  const TOKEN = '';

  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);

  const screenWidth = Dimensions.get('window').width - 40;

  useEffect(() => {
    async function fetchTallyData() {
      try {
        if (!formId) {
          console.error('Nenhum formId fornecido');
          return;
        }

        const response = await fetch(`https://api.tally.so/forms/${formId}/submissions`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro ao buscar submissões:', response.status, errorText);
          return;
        }

        const json = await response.json();

        setQuestions(json.questions || []);
        setSubmissions(json.submissions || []);
      } catch (error) {
        console.error('Erro ao consumir API do Tally:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTallyData();
  }, [formId]);

  const handleSelectQuestion = (question: any) => {
    setSelectedQuestion(question);
    processAnswers(question);
  };

  const processAnswers = (question: any) => {
    if (!question || submissions.length === 0) {
      setLabels([]);
      setData([]);
      return;
    }

    const contagem: Record<string, number> = {};

    submissions.forEach((sub) => {
      const resp = sub.responses.find((r: any) => r.questionId === question.id);
      if (resp) {
        const answer = resp.answer;
        if (answer !== undefined && answer !== null && answer !== '') {
          contagem[answer] = (contagem[answer] || 0) + 1;
        }
      }
    });

    const labelsArr = Object.keys(contagem);
    const dataArr = labelsArr.map((lbl) => contagem[lbl]);

    setLabels(labelsArr);
    setData(dataArr);
  };

  const cleanText = (text: string) => {
    return text.replace(/&nbsp;|&#160;/g, ' ').trim();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gráficos do Formulário</Text>
      <Text style={styles.label}>Título:</Text>
      <Text style={styles.value}>{titulo}</Text>

      <Text style={styles.label}>Perguntas:</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : questions.length === 0 ? (
        <Text style={{ color: 'gray' }}>Nenhuma pergunta encontrada.</Text>
      ) : (
        questions.map((q) => (
          <TouchableOpacity
            key={q.id}
            style={[
              styles.questionButton,
              selectedQuestion?.id === q.id && styles.selectedQuestionButton,
            ]}
            onPress={() => handleSelectQuestion(q)}
          >
            <Text style={styles.questionText}>{cleanText(q.title)}</Text>
          </TouchableOpacity>
        ))
      )}

      {selectedQuestion && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.label}>
            Gráfico da pergunta: <Text style={{ color: '#3b82f6' }}>{cleanText(selectedQuestion.title)}</Text>
          </Text>

          {data.length > 0 ? (
            <BarChart
              data={{ labels, datasets: [{ data }] }}
              width={screenWidth}
              height={300}
              yAxisLabel=""
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: () => '#000',
                style: { borderRadius: 8 },
              }}
              verticalLabelRotation={30}
              style={{ borderRadius: 8 }}
            />
          ) : (
            <Text style={{ marginTop: 12, color: 'gray' }}>
              Nenhuma resposta encontrada para essa pergunta.
            </Text>
          )}
        </View>
      )}

<TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
  <Text style={styles.backButtonText}>Voltar</Text>
</TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
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
  questionButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  selectedQuestionButton: {
    backgroundColor: '#dbeafe',
  },
  questionText: {
    color: '#111',
  },
});
