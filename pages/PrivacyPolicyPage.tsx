import React, { useEffect } from 'react';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Política de Privacidade - Curiozando';
  }, []);

  return (
    <div className="max-w-3xl mx-auto prose lg:prose-xl">
      <h1>Política de Privacidade</h1>
      <p><em>Última atualização: 29 de julho de 2024</em></p>

      <p>
        Bem-vindo ao Curiozando. A sua privacidade é de extrema importância para nós. Esta Política de Privacidade
        descreve como coletamos, usamos, protegemos e compartilhamos suas informações pessoais quando você visita nosso
        website.
      </p>

      <h2>1. Informações que Coletamos</h2>
      <p>
        Podemos coletar informações pessoais que você nos fornece diretamente, como quando você se inscreve em nossa
        newsletter ou entra em contato conosco. Isso pode incluir:
      </p>
      <ul>
        <li>Nome</li>
        <li>Endereço de e-mail</li>
      </ul>
      <p>
        Também coletamos informações automaticamente através de cookies e tecnologias semelhantes, como:
      </p>
      <ul>
        <li>Endereço IP</li>
        <li>Tipo de navegador e sistema operacional</li>
        <li>Páginas visitadas e tempo de permanência</li>
        <li>Links clicados e outras ações no site</li>
      </ul>

      <h2>2. Como Usamos Suas Informações</h2>
      <p>As informações que coletamos são usadas para:</p>
      <ul>
        <li>Operar e manter nosso site</li>
        <li>Melhorar sua experiência de navegação</li>
        <li>Enviar newsletters e e-mails promocionais (com seu consentimento)</li>
        <li>Responder às suas perguntas e fornecer suporte</li>
        <li>Analisar o tráfego do site para entender o comportamento do usuário</li>
        <li>Prevenir fraudes e garantir a segurança do nosso site</li>
      </ul>

      <h2>3. Cookies e Anúncios</h2>
      <p>
        Usamos cookies para armazenar informações e personalizar sua experiência. Terceiros, como o Google AdSense,
        também podem usar cookies para exibir anúncios relevantes com base em suas visitas anteriores ao nosso site ou
        a outros sites. Você pode optar por desativar a publicidade personalizada visitando as Configurações de anúncios
        do Google.
      </p>

      <h2>4. Compartilhamento de Informações</h2>
      <p>
        Não vendemos, trocamos ou alugamos suas informações pessoais a terceiros. Podemos compartilhar informações
        agregadas e não identificáveis com nossos parceiros de negócios e anunciantes para fins de análise.
      </p>

      <h2>5. Seus Direitos</h2>
      <p>
        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Se desejar exercer esses
        direitos, entre em contato conosco através do e-mail fornecido na nossa página de contato.
      </p>

      <h2>6. Alterações a Esta Política</h2>
      <p>
        Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre quaisquer alterações
        publicando a nova política nesta página e atualizando a data da "Última atualização".
      </p>

      <h2>7. Contato</h2>
      <p>
        Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
