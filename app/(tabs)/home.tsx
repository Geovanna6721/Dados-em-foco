import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ListRenderItem,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import axios from 'axios';

interface Formulario {
  id: string;
  titulo: string;
  linkPerguntas: string;
  linkRespostas: string;
}

export default function Home(): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [linkPerguntas, setLinkPerguntas] = useState('');
  const [linkRespostas, setLinkRespostas] = useState('');
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const router = useRouter();

  // URL do backend (ajuste para seu servidor real)
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    const carregarFormularios = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/forms`);
        const dados: Formulario[] = response.data.map((form: any) => ({
          id: form._id,
          titulo: form.name,
          linkPerguntas: form.questionsLink,
          linkRespostas: form.answersLink,
        }));
        setFormularios(dados);
      } catch (error) {
        console.error('Erro ao carregar formulários:', error);
        Alert.alert('Erro', 'Não foi possível carregar os formulários.');
      }
    };

    carregarFormularios();
  }, []);

  const limparCampos = () => {
    setTitulo('');
    setLinkPerguntas('');
    setLinkRespostas('');
  };

  const adicionarFormulario = async () => {
    if (!titulo.trim() || !linkPerguntas.trim() || !linkRespostas.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/forms`, {
        name: titulo.trim(),
        questionsLink: linkPerguntas.trim(),
        answersLink: linkRespostas.trim(),
      });

      const formCriado = response.data;

      const novoFormulario: Formulario = {
        id: formCriado._id,
        titulo: formCriado.name,
        linkPerguntas: formCriado.questionsLink,
        linkRespostas: formCriado.answersLink,
      };

      setFormularios(prev => [novoFormulario, ...prev]);
      limparCampos();
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao adicionar formulário:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o formulário.');
    }
  };

  const renderFormulario: ListRenderItem<Formulario> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/grafico',
          params: {
            titulo: item.titulo,
            formId: item.linkRespostas.trim(), // Passa só o formId limpo
          },
        })
      }
    >
      <Text style={styles.cardTitulo}>{item.titulo}</Text>
      <Text style={styles.cardLabel}>Link Perguntas:</Text>
      <Text style={styles.cardLink}>{item.linkPerguntas}</Text>
      <Text style={styles.cardLabel}>Link Respostas:</Text>
      <Text style={styles.cardLink}>{item.linkRespostas}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.titulo}>Meus Formulários</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Adicionar Formulário</Text>
      </TouchableOpacity>

      {formularios.length === 0 ? (
        <Text style={styles.semFormulariosText}>Nenhum formulário criado.</Text>
      ) : (
        <FlatList
          data={formularios}
          keyExtractor={item => item.id}
          renderItem={renderFormulario}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Novo Formulário</Text>

            <TextInput
              placeholder="Título"
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
            />
            <TextInput
              placeholder="Link de perguntas"
              style={styles.input}
              value={linkPerguntas}
              onChangeText={setLinkPerguntas}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TextInput
              placeholder="Link de respostas"
              style={styles.input}
              value={linkRespostas}
              onChangeText={setLinkRespostas}
              autoCapitalize="none"
              keyboardType="url"
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  limparCampos();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={adicionarFormulario}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  logo: {
    width: 90,
    height: 90,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  semFormulariosText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardLabel: {
    fontWeight: '600',
    color: '#444',
    marginTop: 6,
  },
  cardLink: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 12,
    fontSize: 16,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
