export class View {
    static render(template, model) {
        template += 'Temp'
        const element = document.getElementById(template),
            elementSrc = element.innerHTML,
            renderFn = Handlebars.compile(elementSrc)

        return renderFn(model)
    }
}