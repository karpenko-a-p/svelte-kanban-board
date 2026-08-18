<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Checkbox from './Checkbox.svelte';

  const { Story } = defineMeta({
    component: Checkbox,
    title: 'Checkbox'
  });
</script>

<Story name="Primary">Checkbox content</Story>

<Story name="Checked" args={{ checked: true }}>Checkbox content</Story>

<Story name="Error" args={{ invalid: true, errorMessage: 'Error message' }}>Checkbox content</Story>

<Story name="Disabled" args={{ disabled: true }}>Checkbox content</Story>

<Story name="Disabled and checked" args={{ disabled: true, checked: true }}>Checkbox content</Story>

<Story name="Disabled and error" args={{ checked: true, disabled: true, invalid: true, errorMessage: 'Error message' }}>
  Checkbox content
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
