
import React, { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

export default function App() {
  const [permissaoConcedida, setPermissaoConcedida] = useState(false);
  const [segundos, setSegundos] = useState(10);
  const [statusMensagem, setStatusMensagem] = useState('Aguardando ação...');
  const [pendentesCount, setPendentesCount] = useState(0);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    inicializar();
  }, []);

  // Inicialização
  const inicializar = async () => {
    await verificarPermissao();
    await atualizarPendentes();
  };

  // 1. Verificar permissão
  const verificarPermissao = async () => {
    try {
      const status = await LocalNotifications.checkPermissions();

      setPermissaoConcedida(status.display === 'granted');

      setStatusMensagem(
        status.display === 'granted'
          ? 'Permissão de notificações ativa!'
          : 'Permissão ainda não concedida.'
      );
    } catch (error) {
      console.error(error);
      setStatusMensagem('Erro ao verificar permissões.');
    }
  };

  // 2. Solicitar permissão
  const solicitarPermissao = async () => {
    try {
      let status = await LocalNotifications.checkPermissions();

      if (status.display !== 'granted') {
        status = await LocalNotifications.requestPermissions();
      }

      if (status.display === 'granted') {
        setPermissaoConcedida(true);
        setStatusMensagem('Permissão concedida com sucesso!');
        return true;
      }

      setPermissaoConcedida(false);
      setStatusMensagem('Permissão bloqueada pelo usuário.');
      return false;

    } catch (error) {
      console.error(error);
      setStatusMensagem('Erro ao solicitar permissão.');
      return false;
    }
  };

  // 3. Notificação imediata
  const dispararNotificacaoImediata = async () => {
    try {
      const permitido = await solicitarPermissao();

      if (!permitido) return;

      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'JapaSushi Delivery 🍣',
            body: 'Seu pedido #260 foi recebido com sucesso!',
            id: 259,
            sound: null,
            extra: {
              pedidoId: 260,
              etapa: 'recebido'
            }
          }
        ]
      });

      setStatusMensagem('Notificação de pedido recebido enviada!');

      await atualizarPendentes();

    } catch (error) {
      console.error(error);
      setStatusMensagem('Erro ao enviar notificação.');
    }
  };

  // 4. Função para agendar cada etapa usando setTimeout
  const agendarEtapa = (notificacao, atraso) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await LocalNotifications.schedule({
            notifications: [notificacao]
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      }, atraso);
    });
  };

  // 5. Agendamento sequencial das três etapas
  const agendarSequenciaPedido = async () => {
    try {
      const status = await LocalNotifications.checkPermissions();

      if (status.display !== 'granted') {
        setPermissaoConcedida(false);
        setStatusMensagem('Solicite a permissão primeiro!');
        return;
      }

      if (carregando) return;

      setCarregando(true);

      // Tempo inicial
      const inicio = Date.now();

      const primeiroTempo = Math.max(10, Number(segundos) || 10);

      // Etapa 1: Pedido recebido
      const pedidoRecebido = {
        title: 'JapaSushi Delivery 📥',
        body: 'Seu pedido #260 foi recebido com sucesso!',
        id: 260,
        schedule: {
          at: new Date(inicio + primeiroTempo * 1000)
        },
        extra: {
          pedidoId: 260,
          etapa: 'recebido'
        }
      };

      // Etapa 2: Preparando
      const pedidoPreparando = {
        title: 'JapaSushi Delivery 🍱',
        body: 'Seu Combo Salmão está sendo preparado!',
        id: 261,
        schedule: {
          at: new Date(inicio + (primeiroTempo + 10) * 1000)
        },
        extra: {
          pedidoId: 260,
          etapa: 'preparando'
        }
      };

      // Etapa 3: Saiu para entrega
      const pedidoEntregando = {
        title: 'JapaSushi Delivery 🛵',
        body: 'Seu Combo Salmão saiu para entrega!',
        id: 262,
        schedule: {
          at: new Date(inicio + (primeiroTempo + 20) * 1000)
        },
        extra: {
          pedidoId: 260,
          etapa: 'entregando'
        }
      };

      // DESAFIO EXTRA: setTimeout encadeando os schedules

      await agendarEtapa(pedidoRecebido, 0);

      setStatusMensagem('1ª etapa agendada: Pedido recebido!');

      await agendarEtapa(pedidoPreparando, 100);

      setStatusMensagem('2ª etapa agendada: Preparando!');

      await agendarEtapa(pedidoEntregando, 100);

      setStatusMensagem(
        'As 3 etapas do pedido foram agendadas com sucesso!'
      );

      await atualizarPendentes();

    } catch (error) {
      console.error(error);
      setStatusMensagem('Erro ao agendar sequência do pedido.');
    } finally {
      setCarregando(false);
    }
  };

  // 6. Consultar notificações pendentes
  const atualizarPendentes = async () => {
    try {
      const resultado = await LocalNotifications.getPending();

      setPendentesCount(resultado.notifications.length);

    } catch (error) {
      console.error(error);
    }
  };

  // 7. Cancelar notificações do pedido
  const cancelarSequencia = async () => {
    try {
      await LocalNotifications.cancel({
        notifications: [
          { id: 260 },
          { id: 261 },
          { id: 262 }
        ]
      });

      setStatusMensagem('Sequência do pedido cancelada!');

      await atualizarPendentes();

    } catch (error) {
      console.error(error);
      setStatusMensagem('Erro ao cancelar sequência.');
    }
  };

  // 8. Cancelar todas as notificações
  const cancelarTodas = async () => {
    try {
      const resultado = await LocalNotifications.getPending();

      if (resultado.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: resultado.notifications
        });

        setStatusMensagem('Todas as notificações foram canceladas!');
      } else {
        setStatusMensagem('Não existem notificações pendentes.');
      }

      await atualizarPendentes();

    } catch (error) {
      console.error(error);
      setStatusMensagem('Erro ao cancelar notificações.');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-5 flex justify-center items-center">

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

        {/* CABEÇALHO */}
        <header className="text-center mb-6">

          <h1 className="text-3xl font-bold text-red-600">
            🍣 JapaSushi
          </h1>

          <p className="text-slate-500 font-semibold">
            DELIVERY
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Programação para Dispositivos Móveis II
          </p>

          <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full mt-3 font-bold">
            Aluno 26
          </span>

        </header>

        {/* STATUS DA PERMISSÃO */}
        <section className="bg-slate-100 p-4 rounded-xl mb-5">

          <h2 className="font-bold text-lg mb-2">
            🔔 Permissão de Notificações
          </h2>

          <p className="mb-3">
            {permissaoConcedida
              ? 'Concedida ✅'
              : 'Não concedida ❌'}
          </p>

          <button
            onClick={solicitarPermissao}
            className="bg-blue-600 text-white p-3 rounded-lg w-full font-bold"
          >
            Verificar / Ativar Permissão
          </button>

        </section>

        {/* NOTIFICAÇÃO IMEDIATA */}
        <section className="mb-5">

          <h2 className="font-bold mb-3 text-slate-700">
            📦 Pedido #260
          </h2>

          <button
            onClick={dispararNotificacaoImediata}
            className="bg-green-600 text-white p-3 rounded-lg w-full font-bold"
          >
            🚀 Notificação Imediata
          </button>

        </section>

        {/* SEQUÊNCIA DE NOTIFICAÇÕES */}
        <section className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-5">

          <h2 className="font-bold text-lg mb-3 text-orange-700">
            📋 Acompanhamento do Pedido
          </h2>

          <div className="space-y-3 mb-4">

            <div className="bg-white p-3 rounded-lg">
              📥 <strong>1. Recebido</strong>
              <p className="text-sm text-slate-500">
                Pedido recebido com sucesso.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg">
              🍱 <strong>2. Preparando</strong>
              <p className="text-sm text-slate-500">
                Seu pedido está sendo preparado.
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg">
              🛵 <strong>3. Entregando</strong>
              <p className="text-sm text-slate-500">
                Seu pedido saiu para entrega.
              </p>
            </div>

          </div>

          <label className="font-bold block mb-2">
            Tempo para primeira notificação (segundos)
          </label>

          <input
            type="number"
            min="10"
            value={segundos}
            onChange={(e) => setSegundos(e.target.value)}
            className="border border-orange-300 p-3 rounded-lg w-full mb-3"
          />

          <p className="text-xs text-slate-500 mb-3">
            As próximas notificações serão enviadas com intervalos de 10 segundos.
          </p>

          <button
            onClick={agendarSequenciaPedido}
            disabled={carregando}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white p-3 rounded-lg w-full font-bold"
          >
            {carregando
              ? 'Agendando...'
              : '⏱️ Agendar as 3 Etapas'}
          </button>

        </section>

        {/* NOTIFICAÇÕES PENDENTES */}
        <section className="bg-slate-100 p-4 rounded-xl mb-5 text-center">

          <h2 className="font-bold text-lg mb-2">
            Notificações Pendentes
          </h2>

          <p className="text-3xl font-bold text-blue-600">
            {pendentesCount}
          </p>

          <button
            onClick={atualizarPendentes}
            className="bg-blue-500 text-white p-2 rounded-lg w-full mt-3"
          >
            🔄 Atualizar
          </button>

          <button
            onClick={cancelarSequencia}
            className="bg-red-500 text-white p-2 rounded-lg w-full mt-3"
          >
            Cancelar Sequência
          </button>

          <button
            onClick={cancelarTodas}
            className="bg-red-700 text-white p-2 rounded-lg w-full mt-3"
          >
            Cancelar Todas
          </button>

        </section>

        {/* CONSOLE DE STATUS */}
        <section className="bg-slate-900 text-green-400 p-4 rounded-xl">

          <h2 className="font-bold mb-2">
            💻 Console de Status
          </h2>

          <p className="text-sm">
            {statusMensagem}
          </p>

        </section>

        <footer className="text-center text-xs text-slate-400 mt-5">
          JapaSushi Delivery © 2026
        </footer>

      </div>
    </div>
  );
}
