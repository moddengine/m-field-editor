<template>
	<v-row justify="center">
        <v-dialog
            max-width="960px"
            v-model="showModal"
        >
            <v-card>
                <v-card-title class="headline">Edit</v-card-title>

                <v-card-text>
                    <validation-observer ref="formRef">
                        <form>
                            <v-container>
                                <v-row>
                                    <v-col
                                        cols="12"
                                        sm="12"
                                        md="6"
                                    >   
                                        <validation-provider
                                            v-slot="{ errors, dirty }"
                                            name="Name"
                                            rules="required"
                                        >
                                            <v-text-field
                                                label="Name"
                                                v-model="form.name"
                                                :error-messages="!state.focusedName && errors || []"
                                                @focus="state.focusedName = true"
                                                @blur="state.focusedName = false"
                                                :messages="(dirty && state.focusedName) ? ['Changing name field will affect existing data']: []"
                                                v-bind:class="{ 'warning--text': (dirty && state.focusedName) }"

                                            >
                                                <template v-slot:label>
                                                    <div v-bind:class="{ 'warning--text': (dirty && state.focusedName) }">
                                                        Name
                                                    </div>
                                                </template>
                                                <template v-slot:message="{ message }">
                                                    <div v-bind:class="{ 'warning--text': (dirty && state.focusedName) }">
                                                        {{ message }}
                                                    </div>
                                                </template>
                                            </v-text-field>
                                        </validation-provider>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        sm="12"
                                        md="6"
                                    >
                                        
                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="Label"
                                            rules="required"
                                        >
                                            <v-text-field
                                                label="Label"
                                                v-model="form.label"
                                                :error-messages="errors"
                                            ></v-text-field>
                                        </validation-provider>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        sm="12"
                                        md="6"
                                    >
                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="Hint"
                                            rules="required"
                                        >
                                            <v-text-field
                                                label="Hint"
                                                v-model="form.hint"
                                                :error-messages="errors"
                                            ></v-text-field>
                                        </validation-provider>
                                    </v-col>
                                    
                                    <v-col
                                        cols="12"
                                        sm="6"
                                    >
                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="Type"
                                            rules="required"
                                        >
                                            <v-autocomplete
                                                :items="['text', 'textarea', 'select', 'multiple select', 'HTML Editor']"
                                                label="Type"
                                                v-model="form.type"
                                                :error-messages="errors"
                                            ></v-autocomplete>
                                        </validation-provider>
                                    </v-col>

                                    <v-col
                                        cols="12"
                                        sm="12"
                                        md="6"
                                    >
                                        <validation-provider
                                            v-slot="{ errors }"
                                            name="Group Name"
                                            rules="required"
                                        >
                                            <v-text-field
                                                label="Group Name"
                                                v-model="form.group"
                                                :error-messages="errors"
                                            ></v-text-field>
                                        </validation-provider>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </form>
                    </validation-observer>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="onClose"
                    >{{ formRef && formRef.flags.dirty && "Cancel" || "Close" }}</v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        :disabled="!isValid"
                        @click="onSubmit"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, SetupContext } from '@vue/composition-api';
import { required, email, max } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { IFolderTypeFieldInfo } from '@/FieldSchema';
import { VeeObserver } from 'vee-validate/dist/types/types';

interface State {
    focusedName: boolean
}

interface Props {
    show: boolean
    data: IFolderTypeFieldInfo
}

setInteractionMode('eager');
extend('required', {
    ...required,
    message: '{_field_} can not be empty',
});

export default defineComponent({
    props: ['show', 'data'],
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    setup(props: Props, context: SetupContext) {
        const formRef = ref<null | InstanceType<typeof ValidationObserver>>(null);

        const showModal = computed({
            get: () => props.show,
            set: val => {
                context.emit('close');
            }
        });

        const form = computed({
            get: () => ({...props.data}),
            set: val => val
        });

        const isValid = computed(() => {
            if (formRef.value && formRef.value.flags.valid && formRef.value.flags.dirty) {
                return true;
            }

            return false;
        })

        const state = reactive<State>({
            focusedName: false,
        });

        function onClose() {
            context.emit('close');
            context.root.$nextTick(() => {
                formRef.value!.reset();
            });
        }

        function onSubmit() {
            formRef.value!.validate().then((success: boolean) => {
                if (!success) {
                    return;
                }

                context.emit('save', form.value);

                // Wait until the models are updated in the UI
                context.root.$nextTick(() => {
                    formRef.value!.reset();
                });
            });
        }

        return {
            state,
            showModal,
            form,
            onSubmit,
            onClose,
            isValid,
            formRef,
       }
    }
})
</script>
