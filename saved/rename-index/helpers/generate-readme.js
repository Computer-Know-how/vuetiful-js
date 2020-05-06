const changeCase = require('change-case')

module.exports = (package) => {
  const docsLink = `https://www.vuecomponentlibrary.com/components/${changeCase
    .snake(package.moduleName)
    .replace(/_/g, '-')}.html`

  return `\
# [${package.name}](${docsLink})

Go to the [official documentation page](${docsLink}) for more instructions and usage guidelines.

## Installation

### Directly in the browser

Drop the component in with a \`<script>\` tag alongside Vue:

\`\`\`html
<div id="app">
<!-- ... use component here ... -->
</div>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/${package.name}"></script>
<script>
new Vue({ el: '#app' })
</script>
\`\`\`

### In a module system

Install the component with NPM:

\`\`\`bash
npm install ${package.name}
\`\`\`

Then import the component:

\`\`\`js
import ${package.moduleName} from '${package.name}'
\`\`\`

And either globally register it for use in all components:

\`\`\`js
Vue.component(${package.moduleName}, '${package.name}')
\`\`\`

or locally register it for use in an individual component:

\`\`\`js
export default {
components: { ${package.moduleName} }
}
\`\`\`

## Usage

\`\`\`html
${package.example}
\`\`\`
`
}