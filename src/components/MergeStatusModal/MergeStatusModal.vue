<template>
	<transition name="modal-fade">
		<div class="modal-backdrop" role="dialog">
			<div class="modal">
				<header class="modal-header">
					<slot name="header">
						{{ headerMessage }}
						<button type="button" class="btn btn-close --warning" @click="close" aria-label="Close">X</button>
					</slot>
				</header>

				<section class="modal-body">
					<div class="error-icon" :hidden="isSuccess">!</div>
					<div class="success-icon" :hidden="!isSuccess">&#x2713;</div>
					<slot name="body">
						{{ bodyMessage }}
					</slot>
				</section>

				<footer class="modal-footer">
					<slot name="footer">
						<button type="button" class="btn --primary" @click="backToDashboard()">
							Back To Dashboard
						</button>
						<button type="button" class="btn --warning" @click="retry()" :hidden="isSuccess">
							Retry Merge
						</button>
					</slot>
				</footer>
			</div>
		</div>
	</transition>
</template>

<script>
import { EventBus } from '../EventBus/EventBus.js';
export default {
	name: 'vuetiful-merge-status-modal',
	components: {},
	methods: {
		backToDashboard() {
			EventBus.$emit('redirect', 'dashboard');
		},
		close() {
			this.$emit('close');
		},
		retry() {
			this.$emit('retry');
		}
	},
	props: {
		isSuccess: Boolean,
		headerMessage: String,
		bodyMessage: String
	}
};
</script>

<style scoped lang="scss">
@import './MergeStatusModal.scss';
</style>
