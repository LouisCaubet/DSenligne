const mongoose = require("mongoose");

const FilledExamSchema = new mongoose.Schema({

    examId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },

    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },

    dateStarted: {
        type: Date,
        default: null
    },

    expiresAt: {
        type: Date,
        default: null
    },

    answers: {
        type: Object,
        default: null
    },

    done: {
        type: Boolean,
        default: false
    },

    corrected: {
        type: Boolean,
        default: false
    },

    correctionId: {
        type: Number,
        default: null
    }


});

const FilledExam = mongoose.model("FilledExam", FilledExamSchema, "filled-exams");

module.exports = FilledExam;