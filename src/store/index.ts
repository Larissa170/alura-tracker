import { InjectionKey } from "vue";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import {
  ADICIONAR_TAREFA,
  ALTERA_TAREFA,
  DEFINIR_TAREFAS,
  NOTIFICAR,
} from "./tipo-mutacoes";
import { INotificacao } from "@/interfaces/INotificacao";
import { OBTER_TAREFAS, CADASTRAR_TAREFA, ALTERAR_TAREFA } from "./tipo-acoes";
import http from "@/http/index";
import ITarefa from "@/interfaces/ITarefa";
import { EstadoProjeto, projeto } from "./modulos/projeto";
export interface Estado {
  notificacoes: INotificacao[];
  tarefas: ITarefa[];
  projeto: EstadoProjeto;
}
export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
  state: {
    notificacoes: [],
    tarefas: [],
    projeto: {
      projetos: [],
    },
  },
  mutations: {
    [NOTIFICAR](state, novaNotificacao: INotificacao) {
      novaNotificacao.id = new Date().getTime();
      state.notificacoes.push(novaNotificacao);

      setTimeout(() => {
        state.notificacoes = state.notificacoes.filter(
          (notificacao) => notificacao.id != novaNotificacao.id
        );
      }, 3000);
    },
    [DEFINIR_TAREFAS](state, tarefas: ITarefa[]) {
      state.tarefas = tarefas;
    },
    [ADICIONAR_TAREFA](state, tarefa: ITarefa) {
      state.tarefas.push(tarefa);
    },
    [ALTERA_TAREFA](state, tarefa: ITarefa) {
      const index = state.tarefas.findIndex((tar) => tar.id === tarefa.id);
      state.tarefas[index] = tarefa;
    },
  },
  actions: {
    [OBTER_TAREFAS]({ commit }) {
      http
        .get("tarefas")
        .then((response) => commit(DEFINIR_TAREFAS, response.data));
    },
    [CADASTRAR_TAREFA]({ commit }, tarefa: ITarefa) {
      return http
        .post("/tarefas", tarefa)
        .then((response) => commit(ADICIONAR_TAREFA, response.data));
    },
    [ALTERAR_TAREFA]({ commit }, tarefa: ITarefa) {
      return http
        .put(`/tarefas/${tarefa.id}`, tarefa)
        .then(() => commit(ALTERA_TAREFA, tarefa));
    },
  },
  modules: {
    projeto,
  },
});
export function useStore(): Store<Estado> {
  return vuexUseStore(key);
}
