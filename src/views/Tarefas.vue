<template>
  <div class="column is-three-quarter conteudo">
    <Formulario @aoSalvarTarefa="salvarTarefa" />
    <div class="lista">
      <Box v-if="listaEstaVazia"> Você não está muito produtivo hoje :( </Box>
      <div class="field">
        <p class="control has-icons-left">
          <input
            class="input"
            type="text"
            placeholder="Digite para filtrar"
            v-model="filtro"
          />
          <span class="icon is-small is-left">
            <i class="fas fa-search"></i>
          </span>
        </p>
      </div>

      <Tarefa
        v-for="(tarefa, index) in tarefas"
        :key="index"
        :tarefa="tarefa"
        @ao-tarefa-clicada="selecionarTarefa"
      />
      <Modal :mostrar="tarefaSelecionada != null" v-if="tarefaSelecionada">
        <template v-slot:cabecalho class="modal-card-head">
          <p class="modal-card-title">Editando uma Tarefa</p>
          <button
            class="delete"
            @click="fecharModal"
            arial-label="close"
          ></button>
        </template>
        <template v-slot:corpo class="modal-card-body">
          <div class="field">
            <label for="descricaoTarefa" class="label"> Descrição </label>
            <input
              type="text"
              class="input"
              v-model="tarefaSelecionada.descricao"
              id="descricaoTarefa"
            />
          </div>
        </template>
        <template v-slot:rodape class="modal-card-foot">
          <button class="button is-success" @click="alterarTarefa">
            Salvar
          </button>
          <button @click="fecharModal" class="button">Cancelar</button>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import Formulario from "../components/Formulario.vue";
import Tarefa from "../components/Tarefa.vue";
import Box from "../components/Box.vue";
import Modal from "../components/Modal.vue";
import { useStore } from "@/store";
import {
  CADASTRAR_TAREFA,
  OBTER_PROJETOS,
  OBTER_TAREFAS,
  ALTERAR_TAREFA,
} from "@/store/tipo-acoes";
import ITarefa from "@/interfaces/ITarefa";

export default defineComponent({
  name: "App",
  components: {
    Formulario,
    Tarefa,
    Box,
    Modal,
  },
  data() {
    return {
      tarefaSelecionada: null as ITarefa | null,
    };
  },

  computed: {
    listaEstaVazia(): boolean {
      return this.tarefas.length === 0;
    },
  },
  methods: {
    salvarTarefa(tarefa: ITarefa) {
      this.store.dispatch(CADASTRAR_TAREFA, tarefa);
    },
    selecionarTarefa(tarefa: ITarefa) {
      this.tarefaSelecionada = tarefa;
    },
    fecharModal() {
      this.tarefaSelecionada = null;
    },
    alterarTarefa() {
      this.store
        .dispatch(ALTERAR_TAREFA, this.tarefaSelecionada)
        .then(() => this.fecharModal());
    },
  },
  setup() {
    const store = useStore();
    store.dispatch(OBTER_TAREFAS);
    store.dispatch(OBTER_PROJETOS);

    const filtro = ref("");
    // const tarefas = computed(() =>
    //   store.state.tarefa.tarefas.filter(
    //     (t) => !filtro.value || t.descricao.includes(filtro.value)
    //   )
    // );

    watchEffect(() => {
      store.dispatch(OBTER_TAREFAS, filtro.value);
    });

    return {
      tarefas: computed(() => store.state.tarefa.tarefas),
      store,
      filtro,
    };
  },
});
</script>
