import { createComparison, defaultRules, rules } from "../lib/compare.js";

// компаратор (как требует проект)
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // заполнение селектов
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement("option");

                option.value = name;
                option.textContent = name;

                return option;
            })
        );
    });

    // нормализация state под правила compare
    const normalizeState = (state) => {
        const next = { ...state };

        // диапазон суммы (ключевой фикс для тестов)
        const from = next.totalFrom;
        const to = next.totalTo;

        if (from !== undefined || to !== undefined) {
            next.total = [from, to];
        }

        return next;
    };

    return (data, state, action) => {
        // очистка поля
        if (action && action.name === "clear") {
            const parentButton = action.parentElement;
            const inputButton = parentButton.querySelector("input");

            inputButton.value = "";

            state[action.dataset.field] = undefined;
        }

        // фильтрация
        return data.filter(row => compare(row, normalizeState(state)));
    };
}