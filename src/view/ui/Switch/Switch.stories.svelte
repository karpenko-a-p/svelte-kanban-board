<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Switch from './Switch.svelte';

  const { Story } = defineMeta({
    component: Switch,
    title: 'Switch'
  });
</script>

<Story name="Main">Lorem ipsum dolor sit.</Story>

<Story name="Error" args={{ invalid: true, errorMessage: 'Error' }}>Lorem ipsum dolor sit.</Story>

<Story name="Disabled" args={{ disabled: true }}>Lorem ipsum dolor sit.</Story>

<Story name="Disabled and error" args={{ disabled: true, invalid: true, errorMessage: 'Error' }}>
  Lorem ipsum dolor sit.
</Story>

<Story name="Custom content">
  <p>
    <strong>Lorem ipsum dolor sit amet consectetur adipisicing elit</strong>. Necessitatibus culpa dignissimos
    accusamus. Laborum voluptates saepe maxime maiores sint consequatur accusantium quidem fuga laboriosam veniam
    eveniet corrupti nemo recusandae sit, perferendis unde obcaecati! Vel dicta, ullam veritatis eligendi facilis aut et
    deserunt autem asperiores perferendis nulla vitae nam harum sequi recusandae quae aperiam iusto. Porro voluptatem
    autem facere pariatur, <i>dolore illo aliquam sint</i>. Dicta dolores maxime, non aspernatur animi architecto
    doloribus accusantium! Facere sequi quaerat quo minima accusantium perferendis laboriosam omnis eveniet, cumque esse
    excepturi iste! A eos, adipisci amet facere nam sit consequuntur, cum, veritatis quod atque reprehenderit veniam
    itaque?
  </p>
</Story>
