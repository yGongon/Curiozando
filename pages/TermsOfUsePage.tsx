import React, { useEffect } from 'react';

const TermsOfUsePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Termos de Uso - Curiozando';
  }, []);

  return (
    <div className="max-w-3xl mx-auto prose lg:prose-xl">
      <h1>Termos de Uso</h1>
      <p><em>Última atualização: 29 de julho de 2024</em></p>

      <p>
        Ao acessar e utilizar o website Curiozando, você concorda em cumprir e estar vinculado aos seguintes
        termos e condições de uso. Se você não concordar com estes termos, por favor, não use nosso site.
      </p>

      <h2>1. Uso do Conteúdo</h2>
      <p>
        Todo o conteúdo publicado neste site, incluindo textos, imagens, gráficos e logotipos, é propriedade do
        Curiozando ou de seus criadores de conteúdo e é protegido por leis de direitos autorais. O conteúdo é
        fornecido apenas para sua informação pessoal e não comercial.
      </p>
      <p>
        É proibida a reprodução, distribuição, modificação ou qualquer outro uso do conteúdo sem a permissão prévia
        por escrito do Curiozando.
      </p>

      <h2>2. Conduta do Usuário</h2>
      <p>Você concorda em não usar o site para:</p>
      <ul>
        <li>Publicar qualquer material ilegal, prejudicial, ameaçador ou difamatório.</li>
        <li>Violar a privacidade ou os direitos de propriedade intelectual de terceiros.</li>
        <li>Tentar obter acesso não autorizado aos nossos sistemas ou redes.</li>
        <li>Interferir no funcionamento normal do site.</li>
      </ul>

      <h2>3. Isenção de Garantias</h2>
      <p>
        O conteúdo do Curiozando é fornecido "como está". Não oferecemos garantias de qualquer tipo, expressas ou
        implícitas, sobre a precisão, confiabilidade ou integridade do conteúdo. O uso do site é por sua conta e
        risco.
      </p>

      <h2>4. Limitação de Responsabilidade</h2>
      <p>
        Em nenhuma circunstância o Curiozando ou seus colaboradores serão responsáveis por quaisquer danos diretos,
        indiretos, incidentais ou consequenciais resultantes do uso ou da incapacidade de usar nosso site.
      </p>

      <h2>5. Links para Terceiros</h2>
      <p>
        Nosso site pode conter links para websites de terceiros. Esses links são fornecidos apenas para sua
        conveniência. Não temos controle sobre o conteúdo desses sites e não somos responsáveis por eles.
      </p>

      <h2>6. Alterações nos Termos</h2>
      <p>
        Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor
        imediatamente após a publicação no site. É sua responsabilidade revisar os termos periodicamente.
      </p>

      <h2>7. Lei Aplicável</h2>
      <p>
        Estes Termos de Uso serão regidos e interpretados de acordo com as leis do Brasil.
      </p>
    </div>
  );
};

export default TermsOfUsePage;
